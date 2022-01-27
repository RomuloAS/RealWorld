<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

> ### NestJS codebase containing the RealWorld backend implementation of a blogging platform that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.


----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/RomuloAS/RealWorld.git

Switch to the repo folder

    cd RealWorld
    
Install dependencies
    
    npm install

Set JsonWebToken secret key

    vi src/common/auth/jwt.constants.ts
    
----------

## Database

The codebase implements [Prisma](https://www.prisma.io/) with a [PostgreSQL](https://www.postgresql.org/) database.

[Create](https://www.postgresql.org/docs/9.1/app-createdb.html) a new postgresql database

    createdb DATABASE

Create a file *.env* with the configuration to [connect](https://docs.nestjs.com/recipes/prisma#set-the-database-connection) to the database

    echo DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA" > .env

Replace the placeholders in uppercase with your database credentials

Create tables and make the migration from the [prisma](https://docs.nestjs.com/recipes/prisma) schema

    npx prisma migrate dev --name init

Generate Prisma Client

    npx prisma generate

----------

## Start application

- `npm run start` - Start application
- `npm run start:dev` - Development mode
- `npm run start:prod` - Production mode

----------

Curl request examples can be found in the request.example file. More information about the RealWorld project can be found on https://github.com/gothinkster/realworld