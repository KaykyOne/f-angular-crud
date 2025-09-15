import { writeFileSync } from 'fs';
import { config } from 'dotenv';

config();

const content = `
export const environment = {
  production: false,
  apiUrl: "${process.env.API_URL}",
  apiKey: "${process.env.API_KEY}"
};
`;
