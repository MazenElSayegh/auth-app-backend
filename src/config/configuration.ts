import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
  Env: process.env.NODE_ENV,

  Server: {
    Host: process.env.SERVER_HOST,
    Port: process.env.SERVER_PORT,
  },

  Database: {
    Host: process.env.DATABASE_HOST,
    Username: process.env.DATABASE_USERNAME,
    Port: parseInt(process.env.DATABASE_PORT ?? '3000', 10),
    Password: process.env.DATABASE_PASSWORD,
    Name: process.env.DATABASE_PASSWORD,
  },

  Auth: {
    Jwt: {
      Key: process.env.AUTH_JWT_KEY,
    },
  },
}));
