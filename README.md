# NestJS Backend + React Frontend

## 1. Prerequisite

Dependencies:

1. NodeJS - v19.x.x
2. npm - v9.5.1
3. PostgreSQL - v15.2

Database commands:

```sql
CREATE DATABASE "database";
--               ^^^^^^^^
--               can be replaced with any database name
```

## 2. Creating and Seeding Tables

File: db_dump/database.sql

```
psql -U postgres -d database -f db_dump/database.sql
```

Replace `postgres` with your database username, `database` with the name of the database you want to restore the dump into.

## 3. Starting Server

Navigate to `backend` directory. All backend command should be executed in this directory.

```sh
cd backend
```

Create `.env` with the following variables:

```sh
DATABASE_URL="postgres://postgres:abc123@127.0.0.1:5432/database"
```

Run install and start command

```sh
npm install
npm run start:dev
```

Application will be started at port **3001**. Verify service with curl

```sh
curl http://localhost:3001/products/search-options
```

## 4. Starting Web App

Navigate to `frontend` directory. All frontend command should be executed in this directory.

```sh
cd frontend
```

React app is using a defaulted environment variable of

```typescript
process.env.REACT_APP_BACKEND_URL ??= "http://localhost:3001";
```

However, if this value must change, specify in `.env`.

Run installation command and start:

```
npm install
npm start
```

## 5. Quick Reset

Running the following command will attempt to drop all tables, recreate tables, reseed, and simultaneously start server and web app in one command

```sh
bash reset-and-start.sh "postgres://postgres:abc123@127.0.0.1:5432/database"
```
