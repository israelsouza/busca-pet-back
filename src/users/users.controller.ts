import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalUserDTO } from './schema e dto/user.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create/local')
  @UsePipes(ZodValidationPipe)
  public async registerLocal(@Body() data: LocalUserDTO) {
    return await this.usersService.registerLocalUser(data);
  }
}
