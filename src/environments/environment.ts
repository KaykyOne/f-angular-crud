import { config } from 'dotenv';

config();

export const environment = {
  production: false,
  apiUrl: `${process.env.API_URL}`,
  apiKey: `${process.env.API_KEY}`
};


