import {Elysia, t} from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from "@elysiajs/cors";
import {logger} from '@bogeychan/elysia-logger';
import jwt from "@elysiajs/jwt";
import dotenv from 'dotenv';

dotenv.config()
const WEB_URL = process.env.WEB_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET || "UL-WebClub"
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'U-Library Backend API Documentation',
                version: '1.0.0'
            }
        }
    }))
    .use(cors({
        origin: WEB_URL,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Origin', 'Cookie', 'Accept']
    }))
    .use(logger({
        stream: process.stdout,
        level: "error",
    }))
    .use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET,
        })
    )
    .get('/', () => {return  'Welcome to VGORC TM API Backend'})
    .get('/ping', () => {return 'Pong!'})
    .listen(3000);

console.log(
    `📚Welcome U-Library API System ${BASE_URL}`
);