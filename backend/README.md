# Drizzle-Postgres-Redis-Template

Preconfigured build to create and migrate schema from Drizzle ORM to Postgres which you can view in adminer. Also includes Redis which deals with handling user's session and all in TypeScript. Zod is used to validate user input inlcuding the environment variables. All services can be deployed with one docker command.

# Prerequisite:

1. Docker

### If you don't have docker then the prerequisite is:

1. NodeJS or Bun installed
2. Postgres (either local or cloud url)
3. Redis (either local or cloud url)
4. `pnpm` package manager (optional)

# How to install:

1. In terminal type:

```
git clone https://github.com/ritish78/Drizzle-Postgres-Redis-Template
```

2. Then `cd` into the directory:

```
cd Drizzle-Postgres-Redis-Template
```

3. (optional) If you have docker installed, run the command:

```
docker compsose up
```

It will use `Dockerfile.dev` for `backend` service and build four containers `backend`, `postgres`, `redis` and `adminer`.

4. (optional) If you want to use `Bun` instead of `NodeJS`, don't run the command of step 3, run this command instead:

```
docker compose -f docker-compose-bun.yml up
```

It will use `Dockerfile.bundev` for `backend` service and like step 3, it will create four containers.

5. If you don't have docker installed, then run the command to install the dependencies:

```
pnpm install
```

6. Running for the first time, we need to build `user` table created using `drizzle`. To do so, in terminal type:

```
pnpm run migration:generate
```

7. Then, we can push the query to postgres. To do so, in terminal type:

```
pnpm run migration:push
```

8. There is a single command to generate and push to postgres using `drizzle`. So, we can run step 6 and 7 at same time:

```
pnpm run migrate
```

9. Then after the migration is done, you can run the application:

```
pnpm run dev
```

The server will listen on the port specified in `.env.local` file.

### There is an endpoint `/api/v1/ping` which returns the message `pong` to test the server.

# Tech stack used

- Backend: `Node.js` or `Bun` as Runtime, `express` for server, `Zod` for creating schema to validate environment variables and user input
- Database: `PostgreSQL` and `Redis`. `pg` library with `postgres` is used to interact with `PostgreSQL`. `redis` and `connect-redis` is used to connect with `Redis`.
- Security: `Bcrypt` for hashing password, Http-cookie to store SessionID in the browser and SessionID is also stored in `redis` in server.
- Contanerization: `Docker` is used to spin up four docker containers; `backend`, `postgres`, `redis` and `adminer`.

# Screenshot:

1. Registering user using their credentials in the endpoint `/api/v1/auth/register`.
   ![Registering using email and password](https://github.com/ritish78/Drizzle-Postgres-Redis-Template/assets/36816476/0b721861-0fd4-4345-9fbc-0d486d98d65f)

2. Logging in using email and password.
   ![Logging in using email and password](https://github.com/ritish78/Drizzle-Postgres-Redis-Template/assets/36816476/e913b94b-218c-41a3-80f4-e411e2cbd8df)

3. SessionID stored inside http cookie:
   ![SessionID in cookie](https://github.com/ritish78/Drizzle-Postgres-Redis-Template/assets/36816476/52ed5b32-89b1-4824-94ed-57ebf2f24789)

4. In server, we store user's SessionID in redis:
   ![Redis showing session of signed in user](https://github.com/ritish78/Drizzle-Postgres-Redis-Template/assets/36816476/a2e3664e-b375-4da0-9dee-24d11d0a7258)

5. Validating user input using `Zod`.
   ![Custom Error Handling](https://github.com/ritish78/Drizzle-Postgres-Redis-Template/assets/36816476/3161b30c-fdc4-4f27-95dc-a9d81b266ffb)
