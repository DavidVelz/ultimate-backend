import { Request } from 'express';

export interface IRequest extends Request {
  user?: any;
  vhost?: any;
  tenantInfo: any;
  headers: any;
  connection: any;
  query: any;
  cookies: any;
  signedCookies: any;
  path: string;
}
