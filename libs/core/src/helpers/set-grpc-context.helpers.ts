import { Metadata } from 'grpc';
import { GqlContext } from '../';
import { TenantEntity, UserEntity } from '@ultimatebackend/repository';
import { TenantInfo } from '@ultimatebackend/core/mutiltenancy';
import { sanitizeForGrpcMeta } from './sanitize-for-grpc-meta';

export function setRpcContext(ctx: GqlContext, inApp?: boolean): Metadata {
  try {
    const meta = new Metadata();
    meta.set('headers', sanitizeForGrpcMeta((ctx.req as any).headers));

    // @ts-ignore
    if (ctx.isAuthenticated()) {
      meta.set('user', sanitizeForGrpcMeta(ctx.getUser()));
    }

    // @ts-ignore
    if (ctx.req.tenantInfo) {
      // @ts-ignore
      meta.set('x-tenant-info', sanitizeForGrpcMeta(ctx.req.tenantInfo));
    }

    if (inApp) {
      meta.set('inApp', inApp.toString());
    }
    return meta;
  } catch (error) {
    console.error('setRpcContext error', error);
  }
}

export function getIdentityFromCtx(meta: Metadata): {
  user: UserEntity;
  tenant: TenantEntity;
  tenantInfo: TenantInfo;
  inApp: any;
} {
  const gmap = meta.getMap();
  const tempUser = gmap.user;
  const tempInApp = gmap.inapp;
  const tempTenantInfo = gmap['x-tenant-info'];
  const tempTenant = gmap?.tenant;

  let user: UserEntity = null;
  let tenant: TenantEntity = null;
  let tenantInfo: TenantInfo = null;
  let inApp = false;

  if (tempUser && typeof tempUser === 'string') {
    user = JSON.parse(tempUser);
  }
  if (tempInApp && typeof tempInApp === 'string') {
    inApp = Boolean(inApp);
  }
  if (tempTenant && typeof tempTenant === 'string') {
    tenant = JSON.parse(tempTenant);
  }
  if (tempTenantInfo && typeof tempTenantInfo === 'string') {
    tenantInfo = JSON.parse(tempTenantInfo);
  }

  return {
    user,
    tenant,
    tenantInfo,
    inApp,
  };
}
