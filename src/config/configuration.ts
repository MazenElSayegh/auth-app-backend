import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
  Server: {
    Host: process.env.SERVER_HOST,
    Port: parseInt(process.env.SERVER_PORT ?? '3000', 10),
  },

  Database: {
    Host: process.env.DATABASE_HOST,
    Port: parseInt(process.env.DATABASE_PORT ?? '3000', 10),
    Username: process.env.DATABASE_USERNAME,
    Password: process.env.DATABASE_PASSWORD,
    Name: process.env.DATABASE_NAME,
  },

  Auth: {
    Jwt: {
      Key: process.env.AUTH_JWT_KEY,
    },
  },
}));
