import { INestApplication, Logger } from '@nestjs/common';
const session = require('express-session');
import * as passport from 'passport';
import * as redis from 'redis';
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
import { Express } from 'express';
import { NestCloud } from '@nestcloud/core';

const parseIsoDuration = require('parse-iso-duration');
const { RedisStore } = require('connect-redis');

const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

export function authSetup(
  app: INestApplication | Express,
  withPassport: boolean = true,
) {
  try {
    const redisConfig: redis.ClientOpts = NestCloud.global.boot.get(
      'redis',
      {},
    );
    const authConfig: {
      sessionKey?: string;
      sessionSecret?: string;
      domain?: string;
      resave?: boolean;
      rolling?: boolean;
      saveUninitialized?: boolean;
      cookieMaxAge?: string;
      secure?: boolean;
    } = NestCloud.global.boot.get('app.auth', {});

    if (redisConfig?.password === '') {
      delete redisConfig.password;
    }

    // redis init
    const redisClient = redis.createClient({
      ...redisConfig,
    });

    const store = new RedisStore({ client: redisClient });

    // sessions
    const sessionMiddleware = session({
      secret: authConfig.sessionSecret,
      resave: Boolean(authConfig?.resave),
      rolling: Boolean(authConfig?.rolling),
      saveUninitialized: false,
      cookie: {
        maxAge: parseIsoDuration('PT' + authConfig.cookieMaxAge),
        secure: Boolean(authConfig?.secure),
        domain: authConfig?.domain,
      },
      // proxy: withPassport === true ? undefined : true,
      store,
      name: authConfig.sessionKey,
    });

    const anyApp = app as any;

    if (withPassport) {
      // @ts-ignore
      // anyApp.set('trust proxy', 1);
      anyApp.use(sessionMiddleware);
      anyApp.use(useragent.express());
      anyApp.use(passportMiddleware);
      anyApp.use(passportSessionMiddleware);
    } else {
      anyApp.use(cookieParser());
    }

    // @ts-ignore
    anyApp.set('subdomain offset', 1); // Enable sub domain in app
  } catch (e) {
    Logger.log(e, 'auth.setup');
  }
}
