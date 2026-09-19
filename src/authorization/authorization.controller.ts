import { Controller, Inject, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Controller('/v1/authorization')
export class AuthorizationController {
  constructor(
    @Inject(AuthorizationService)
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Post('/initialPermissions')
  public createInitialPermissions() {
    return this.authorizationService.createInitialPermissions();
  }
}
