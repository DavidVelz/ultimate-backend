import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { NestCasbinModule } from 'nestjs-casbin';
import { CasbinUserConfigService } from './casbin-config';
import { CoreModule, ServiceRegistryModule } from '@ultimatebackend/core';
import { AdapterProviderModule } from './adapter.provider';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    NestCasbinModule.registerAsync({
      imports: [AdapterProviderModule],
      useClass: CasbinUserConfigService,
    }),
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
