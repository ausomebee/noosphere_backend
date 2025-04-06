import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Noosphere API Documentation',
            version: '1.0.0',
            description: 'API documentation for Noosphere Multi-tenant platform',
        },
        servers: [
            {
                url: process.env.SERVER_URL,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [

    ],
};

export const specs = swaggerJsdoc(options);
