import { createZodDto } from 'nestjs-zod';
import { localUserSchema, newLocalUserEntity } from './user.schema';

export class LocalUserDTO extends createZodDto(localUserSchema) {}
export class NewLocalUserDTO extends createZodDto(newLocalUserEntity) {}
