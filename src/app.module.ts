import { Module } from '@nestjs/common';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [HelloWorldModule, UsersModule, StorageModule, AuthorizationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
