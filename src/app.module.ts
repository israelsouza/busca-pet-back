import { Module } from '@nestjs/common';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HelloWorldModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
