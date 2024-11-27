import {Elysia, t} from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from "@elysiajs/cors";
import {logger} from '@bogeychan/elysia-logger';
import jwt from "@elysiajs/jwt";
import dotenv from 'dotenv';
import {Auth} from "./Runtime/Auth";

dotenv.config()
export const BASE_URL = process.env.LIB_BASE_URL || 'http://localhost:3000';
export const WEB_URL = process.env.LIB_WEB_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.LIB_JWT_SECRET || 'Createch';

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
    .get('/env/:prefix', async ({params: {prefix}}) => {
        let env: {[Keys: string]: string} = {};
        const localEnv = process.env;
        Object.keys(localEnv).forEach(key => {
            if (key.startsWith(prefix)) {
                env[key] = localEnv[key] || "";
            }
        });
        ['LIB_JWT_SECRET', 'LIB_ADMIN_PASSWORD', 'LIB_REFEREE_PASSWORD'].forEach(key => {
            if (key in env) {
                delete env[key];
            }
        });
        return env;
    }, {
        params: t.Object({
            prefix: t.String()
        })
    })
    .decorate('auth', new Auth())
    .post('/auth/:module', async ({ auth, jwt, cookie: { permission }, params ,body: {authId, authPassword}}) => {
        if (auth.checkAuth(authId, authPassword)) {
            permission.set({
                value: await jwt.sign(params),
                httpOnly: true,
                maxAge: 5 * 86400,
            })
        }
        return permission.cookie;
    }, {
        body: t.Object({
            authId: t.String(),
            authPassword: t.String()
        }),
        params: t.Object({
            module: t.String()
        })
    })
    .post("/auth/check", async ({ jwt, body }) => {
        const token = await jwt.verify(body.cookie);
        // @ts-ignore
        if (token.module === 'admin') {
            return true;
        }
        // @ts-ignore
        return token.module === body.module;
    }, {
        body: t.Object({
            module: t.String(),
            cookie: t.String()
        })
    })
    .listen(3000);

console.log(
    `📚Welcome U-Library API System ${BASE_URL}`
);