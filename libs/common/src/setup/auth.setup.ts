import { INestApplication, Logger } from '@nestjs/common';
import { Express } from 'express';
import { NestCloud } from '@nestcloud/core';

import * as passport from 'passport';
import * as redis from 'redis';

const session = require('express-session');
const connectRedis = require('connect-redis');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const parseIsoDuration = require('parse-iso-duration');

const RedisStore = connectRedis(session);

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

    const redisClient = redis.createClient({
      ...redisConfig,
    });

    redisClient.on('error', (err) => {
      Logger.error(err, 'Redis');
    });

    const store = new RedisStore({
      client: redisClient,
    });

    const sessionMiddleware = session({
      store,
      secret: authConfig.sessionSecret,
      resave: Boolean(authConfig.resave),
      rolling: Boolean(authConfig.rolling),
      saveUninitialized: false,

      cookie: {
        maxAge: parseIsoDuration('PT' + authConfig.cookieMaxAge),
        secure: Boolean(authConfig.secure),
        domain: authConfig.domain,
      },

      name: authConfig.sessionKey,
    });

    const anyApp = app as any;

    if (withPassport) {
      anyApp.use(sessionMiddleware);
      anyApp.use(useragent.express());
      anyApp.use(passportMiddleware);
      anyApp.use(passportSessionMiddleware);
    } else {
      anyApp.use(cookieParser());
    }

    anyApp.set('subdomain offset', 1);
  } catch (e) {
    Logger.error(e, 'auth.setup');
  }
}