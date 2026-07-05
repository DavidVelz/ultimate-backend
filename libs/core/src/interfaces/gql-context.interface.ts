import { Request as ExpressRequest } from 'express';
import { DataSource } from 'apollo-datasource';
import { PassportSubscriptionContext, PassportContext } from 'graphql-passport';
import { UserEntity } from '@ultimatebackend/repository';
import {
  AccessTokenRpcClientService,
  AccountsRpcClientService,
  BillingsRpcClientService,
  RolesRpcClientService,
  TenantsRpcClientService,
  WebhooksRpcClientService,
} from '@ultimatebackend/core/services';
import { Context } from 'apollo-server-core/src/types';
import { TenantInfo } from '@ultimatebackend/core/mutiltenancy';

export interface IRequest {
  tenantInfo?: TenantInfo;
  headers?: any;
  connection?: any;
  query?: any;
  cookies?: any;
  signedCookies?: any;
  path?: string;
}
export interface GqlContext
  extends Partial<PassportContext<UserEntity, IRequest> & Context> {
  connection?: any;
  rpc: {
    account: AccountsRpcClientService;
    tenant: TenantsRpcClientService;
    accessToken: AccessTokenRpcClientService;
    role: RolesRpcClientService;
    billing: BillingsRpcClientService;
    webhook: WebhooksRpcClientService;
  };
}

export interface GqlSubscriptionContext
  extends PassportSubscriptionContext<UserEntity, ExpressRequest>,
    DataSource {}
