import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { LocalUserDTO, NewLocalUserDTO } from './schema e dto/user.dto';
import { HttpService } from '@nestjs/axios';
import argon2 from 'argon2';
import { UserStorage } from '@storage/contracts/user-storage.contract';
import { firstValueFrom } from 'rxjs';

const base = 'http://localhost:3000/api';

// fazer arquivo proprio e em montagem, definir a montagem por ambiente (dev, stg, prod)
const environment = {
  services: {
    authorization: base + '/v1/authorization',
  },
};

export interface InitialPermissions {
  roles: string[];
}

@Injectable()
export class UsersService {
  constructor(
    private readonly userStorage: UserStorage,
    private http: HttpService,
  ) {}

  public async registerLocalUser(data: LocalUserDTO) {
    const result = await this.userStorage.checkEmailAndNickname({ email: data.email, nickname: data.nickname });

    if (result) {
      throw new ConflictException(result.message);
    }

    this.validateTextPasswords(data.password, data.secund_password);

    const hashedPassword: string = await this.generatePasswordHash(data.password);

    const roles: InitialPermissions = await this.createInitialPermissions();

    const newUserEntity: NewLocalUserDTO = {
      person: data.personName,
      email: data.email,
      nickname: data.nickname,
      metadata: {
        authorization: roles,
      },
      type: 'LOCAL',
      passwordHash: hashedPassword,
    };

    const entity = await this.userStorage.createLocalUser(newUserEntity);

    return entity;
  }

  private async createInitialPermissions(): Promise<InitialPermissions> {
    try {
      const { data } = await firstValueFrom(this.http.post<InitialPermissions>(`${environment.services.authorization}/initialPermissions`));

      return data;
    } catch {
      throw new ServiceUnavailableException('O serviço de autorização está temporariamente indisponível.');
    }
  }

  private async generatePasswordHash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private validateTextPasswords(passOne: string, passTwo: string): void {
    if (passOne != passTwo) throw new BadRequestException('Parece que as senhas digitadas não coincidem, tente novamente.');
  }
}
