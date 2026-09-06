import { 
    getPropertyById, 
    deletePropertyById, 
    updatePropertyById 
  } from '../propertyController';
  import { 
    preparedGetPropertyById, 
    preparedDeletePropertyById, 
    preparedDeleteAddress,
    preparedDeleteHouseById,
    preparedDeleteLandById
  } from 'src/db/preparedStatement';
  import { isAdmin } from 'src/utils/isAdmin';
  import { Property, property } from 'src/model/property';
  import { house } from 'src/model/house';
  import { land } from 'src/model/land';
  import db from 'src/db';
  import { hasHouseFields, hasLandFields } from 'src/middleware/validateRequest';
  
  // Mock dependencies
  jest.mock('src/db', () => ({
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  }));
  
  jest.mock('src/db/preparedStatement', () => ({
    preparedGetPropertyById: { execute: jest.fn() },
    preparedGetPropertyBySlug: { execute: jest.fn() },
    preparedDeletePropertyById: { execute: jest.fn() },
    preparedDeleteAddress: { execute: jest.fn() },
    preparedDeleteHouseById: { execute: jest.fn() },
    preparedDeleteLandById: { execute: jest.fn() },
  }));
  
  jest.mock('src/utils/isAdmin');
  jest.mock('src/utils/logger');
  
  jest.mock('src/middleware/validateRequest', () => ({
    hasHouseFields: jest.fn(),
    hasLandFields: jest.fn(),
  }));
  
  describe('propertyController', () => {
    const mockUserId = 'user-123';
    const mockPropertyIdHouse = 'property-123';
    const mockPropertyHouse: Property = {
        id: mockPropertyIdHouse,
        sellerId: 'seller-123',
        title: 'House in great condition is for sale',
        slug: '123-house-in-great-condition-is-for-sale',
        description: 'A beautiful house in a quiet neighborhood. Perfect for families looking for a peaceful place to live.',
        toRent: false,
        propertyType: 'House',
        propertyTypeId: 'house-123',
        address: 'address-123',
        price: 10000000,
        views: 0,
        private: false,
        expiresOn: new Date(Date.now() + 86400000).toISOString(),
        status: 'Sale',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: [],
        availableFrom: new Date().toISOString(),
        availableTill: new Date().toISOString(),
        negotiable: false,
        closeLandmark: 'Near KMC'
    } as unknown as Property;

    const mockPropertyIdLand = 'property-456';
    const mockPropertyLand: Property = {
        id: mockPropertyIdLand,
        sellerId: 'seller-123',
        title: 'Land in great condition is for sale',
        slug: '456-land-in-great-condition-is-for-sale',
        description: 'A beautiful land in a quiet neighborhood. Perfect for families looking for a peaceful place to live.',
        toRent: false,
        propertyType: 'Land',
        propertyTypeId: 'land-123',
        address: 'address-123',
        price: 10000000,
        views: 0,
        private: false,
        expiresOn: new Date(Date.now() + 86400000).toISOString(),
        status: 'Sale',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: [],
        availableFrom: new Date().toISOString(),
        availableTill: new Date().toISOString(),
        negotiable: false,
        closeLandmark: 'Near Airport'
    } as unknown as Property;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getPropertyById', () => {
      it('should return null if property does not exist', async () => {
        (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([]);
  
        const result = await getPropertyById(mockPropertyIdHouse, mockUserId);
        expect(result).toBeNull();
      });
  
      it('should return property if it exists and is public', async () => {
        (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([mockPropertyHouse]);
  
        const result = await getPropertyById(mockPropertyIdHouse, mockUserId);
        expect(result).toEqual(mockPropertyHouse);
        // Verify increaseViewOfProperty was called (indirectly via db.update)
        expect(db.update).toHaveBeenCalledWith(property);
      });
  
      it('should return null if property is private and user is not owner/admin', async () => {
        const privateProperty = { ...mockPropertyHouse, private: true };
        (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([privateProperty]);
        (isAdmin as jest.Mock).mockResolvedValue(false);
  
        const result = await getPropertyById(mockPropertyIdHouse, mockUserId);
        expect(result).toBeNull();
      });
  
      it('should return property if private but user is owner', async () => {
        const privateProperty = { ...mockPropertyHouse, private: true, sellerId: mockUserId };
        (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([privateProperty]);
  
        const result = await getPropertyById(mockPropertyIdHouse, mockUserId);
        expect(result).toEqual(privateProperty);
      });
    });
  
    describe('deletePropertyById', () => {
        it('should return 0 if property does not exist', async () => {
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([]);
            
            const result = await deletePropertyById(mockUserId, mockPropertyIdHouse);
            expect(result).toBe(0);
        });
  
        it('should return 1 and delete property of type house if user is seller', async () => {
            const myProperty: Property = { ...mockPropertyHouse, sellerId: mockUserId };
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([myProperty]);
            
            const result = await deletePropertyById(mockUserId, mockPropertyIdHouse);
            
            expect(result).toBe(1);
            expect(preparedDeletePropertyById.execute).toHaveBeenCalledWith({ propertyId: mockPropertyIdHouse });
            expect(preparedDeleteAddress.execute).toHaveBeenCalledWith({ addressId: myProperty.address });
            expect(preparedDeleteHouseById.execute).toHaveBeenCalledWith({ houseId: myProperty.propertyTypeId });
        });

        it('should return 1 and delete property of type land if user is seller', async () => {
            const myProperty: Property = { ...mockPropertyLand, sellerId: mockUserId };
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([myProperty]);
            
            const result = await deletePropertyById(mockUserId, mockPropertyIdLand);
            
            expect(result).toBe(1);
            expect(preparedDeletePropertyById.execute).toHaveBeenCalledWith({ propertyId: mockPropertyIdLand });
            expect(preparedDeleteAddress.execute).toHaveBeenCalledWith({ addressId: myProperty.address });
            expect(preparedDeleteLandById.execute).toHaveBeenCalledWith({ landId: myProperty.propertyTypeId });
        });
  
        it('should return 1 and delete property if user is admin', async () => {
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([mockPropertyHouse]);
            (isAdmin as jest.Mock).mockResolvedValue(true);
  
            const result = await deletePropertyById(mockUserId, mockPropertyIdHouse);
            
            expect(result).toBe(1);
            expect(preparedDeletePropertyById.execute).toHaveBeenCalledWith({ propertyId: mockPropertyIdHouse });
        });
  
        it('should return -1 if user is not authorized', async () => {
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([mockPropertyHouse]);
            (isAdmin as jest.Mock).mockResolvedValue(false);
  
            const result = await deletePropertyById(mockUserId, mockPropertyIdHouse);
            
            expect(result).toBe(-1);
            expect(preparedDeletePropertyById.execute).not.toHaveBeenCalled();
        });
    });
  
    describe('updatePropertyById', () => {
        const updateFields = { title: 'Luxurious Apartment in Kathmandu', price: 123456789 };
  
        it('should return 0 if property does not exist', async () => {
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([]);
            
            const result = await updatePropertyById(mockPropertyIdHouse, mockUserId, updateFields);
            expect(result).toBe(0);
        });
  
        it('should update house fields if property is house', async () => {
            const myProperty: Property = { ...mockPropertyHouse, sellerId: mockUserId, propertyType: 'House' };
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([myProperty]);
            (hasHouseFields as jest.Mock).mockReturnValue(true);
            
             const houseUpdateFields = { roomCount: 5, ...updateFields };
             
            const result = await updatePropertyById(mockPropertyIdHouse, mockUserId, houseUpdateFields);
            
            expect(result).toBe(1);
            expect(db.update).toHaveBeenCalledWith(house);
             // Should also update property because sellerId matches and updateFields has property keys
            expect(db.update).toHaveBeenCalledWith(property);
        });
        
         it('should update land fields if property is land', async () => {
            const myLandProperty: Property = { ...mockPropertyHouse, sellerId: mockUserId, propertyType: 'Land', propertyTypeId: 'land-123' };
            (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([myLandProperty]);
            (hasHouseFields as jest.Mock).mockReturnValue(false);
            (hasLandFields as jest.Mock).mockReturnValue(true);
            
            const landUpdateFields = { area: '100 sqft', ...updateFields };
             
            const result = await updatePropertyById(mockPropertyIdHouse, mockUserId, landUpdateFields);
            
            expect(result).toBe(1);
            expect(db.update).toHaveBeenCalledWith(land);
            expect(db.update).toHaveBeenCalledWith(property);
        });
  
        it('should return -1 if user is not authorized', async () => {
             (preparedGetPropertyById.execute as jest.Mock).mockResolvedValue([mockPropertyHouse]); 
             (isAdmin as jest.Mock).mockResolvedValue(false);
             (hasHouseFields as jest.Mock).mockReturnValue(false);
            
             const result = await updatePropertyById(mockPropertyIdHouse, mockUserId, updateFields);
             
             expect(result).toBe(-1);
        });
    });
  });
