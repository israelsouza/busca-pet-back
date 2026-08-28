import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserStorage } from './contracts/user-storage.contract';
import { PrismaUserStorage } from './prisma/prisma-user.storage';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: UserStorage,
      useClass: PrismaUserStorage,
    },
  ],
  exports: [PrismaService, UserStorage],
})
export class StorageModule {}
