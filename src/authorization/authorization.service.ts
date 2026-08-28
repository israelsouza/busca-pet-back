import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationService {
  constructor() {}

  public createInitialPermissions() {
    return {
      roles: ['user:common'],
    };
  }

}
