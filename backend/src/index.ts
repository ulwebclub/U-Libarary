import {Elysia, error, t} from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from "@elysiajs/cors";
import {logger} from '@bogeychan/elysia-logger';
import jwt from "@elysiajs/jwt";
import dotenv from 'dotenv';
import {Auth} from "./Runtime/Auth";
import {inventoryGroup} from "./Group/Inventory";
import {userGroup} from "./Group/User";

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
    .get('/', () => {return  'Welcome to U-Library API Backend'})
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
    .post('/auth', async ({ auth, jwt, cookie: { permission } ,body: {email, password}}) => {
        try {
            let authorizeAnswer = auth.checkAuth(email, password);
            if (authorizeAnswer !== "") {
                permission.set({
                    value: await jwt.sign({email, authorizeAnswer}),
                    httpOnly: true,
                    maxAge: 5 * 86400,
                })
                return permission.cookie;
            }
        } catch (e) {
            return error(403, e);
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    })
    .post("/auth/check", async ({ jwt, body }) => {
        const token = await jwt.verify(body.cookie);
        // @ts-ignore
        if (token.authorizeAnswer === 'Admin') {
            return true;
        }
        // @ts-ignore
        if (token.authorizeAnswer === undefined || body.module === undefined) {
            return false
        }
        // @ts-ignore
        return token.authorizeAnswer === body.module;
    }, {
        body: t.Object({
            module: t.String(),
            cookie: t.String()
        })
    })
    .use(inventoryGroup)
    .use(userGroup)
    .listen(3000);

console.log(
    `📚Welcome U-Library API System ${BASE_URL}`
);