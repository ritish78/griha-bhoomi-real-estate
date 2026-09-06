import { updateUser } from '../userController';
import db from 'src/db';
import { user } from 'src/model/user';
import { preparedGetUserById } from 'src/db/preparedStatement';
import hashPassword from 'src/utils/hashPassword';
import logger from 'src/utils/logger';
import { AuthError } from 'src/utils/error';

// Mock dependencies
jest.mock('src/db', () => ({
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
}));

jest.mock('src/db/preparedStatement', () => ({
  preparedGetUserById: {
    execute: jest.fn(),
  },
}));

jest.mock('src/utils/hashPassword');
jest.mock('src/utils/logger');

describe('userController', () => {
  describe('updateUser', () => {
    const mockUserId = 'user-123';
    const mockUpdateFields = {
      firstName: 'John',
      lastName: 'Doe',
      profilePicUrl: 'https://ui.shadcn.com/avatars/05.png',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw AuthError if user does not exist', async () => {
      (preparedGetUserById.execute as jest.Mock).mockResolvedValue([]);

      await expect(updateUser(mockUserId, mockUpdateFields)).rejects.toThrow(AuthError);
      expect(logger.info).toHaveBeenCalledWith(`Updating user of id: ${mockUserId}`);
    });

    it('should update user fields successfully', async () => {
      (preparedGetUserById.execute as jest.Mock).mockResolvedValue([{ id: mockUserId }]);
      
      await updateUser(mockUserId, mockUpdateFields);

      expect(db.update).toHaveBeenCalledWith(user);
      expect(logger.info).toHaveBeenCalledWith(
        `Updated user detail of user id: ${mockUserId}`,
        expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            updatedAt: expect.any(Date)
        }),
        true
      );
    });

    it('should hash password if provided and matches confirmPassword', async () => {
      (preparedGetUserById.execute as jest.Mock).mockResolvedValue([{ id: mockUserId }]);
      (hashPassword as jest.Mock).mockResolvedValue('hashed-password');

      const fieldsWithPassword = {
        password: 'password123',
        confirmPassword: 'password123',
      };

      await updateUser(mockUserId, fieldsWithPassword);

      expect(hashPassword).toHaveBeenCalledWith('password123', expect.any(Number));
       expect(logger.info).toHaveBeenCalledWith(
        `Updated user detail of user id: ${mockUserId}`,
        expect.objectContaining({
            password: 'hashed-password',
            updatedAt: expect.any(Date)
        }),
        true
      );
    });

    it('should not update password if password and confirmPassword do not match', async () => {
        (preparedGetUserById.execute as jest.Mock).mockResolvedValue([{ id: mockUserId }]);

        const fieldsWithMismatchPassword = {
            password: 'password123',
            confirmPassword: 'password456',
        };

        await updateUser(mockUserId, fieldsWithMismatchPassword);

        expect(hashPassword).not.toHaveBeenCalled();
    });
  });
});
