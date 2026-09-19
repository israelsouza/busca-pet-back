import { BadRequestException, ConflictException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { LocalUserDTO, NewLocalUserDTO } from './schema e dto/user.dto';
import { HttpService } from '@nestjs/axios';
import { hash } from '@node-rs/argon2';
import { UserStorage } from '@storage/contracts/user-storage.contract';
import { firstValueFrom } from 'rxjs';

import { environment } from '@/app/environments/environment.loader';

export interface InitialPermissions {
  roles: string[];
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserStorage)
    private readonly userStorage: UserStorage,
    @Inject(HttpService)
    private http: HttpService,
  ) {}

  public async registerLocalUser(data: LocalUserDTO) {
    const result = await this.userStorage.checkEmailAndNickname({ email: data.email, nickname: data.nickname });

    if (result) {
      throw new ConflictException(result.message);
    }

    this.validateTextPasswords(data.password, data.confirmation_password);

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
      const { data } = await firstValueFrom(
        this.http.post<InitialPermissions>(`${environment.services.authorization}/initialPermissions`, null, {
          timeout: 5000,
        }),
      );

      return data;
    } catch {
      throw new ServiceUnavailableException('O serviço de autorização está temporariamente indisponível.');
    }
  }

  private async generatePasswordHash(password: string): Promise<string> {
    return await hash(password);
  }

  private validateTextPasswords(passOne: string, passTwo: string): void {
    if (passOne != passTwo) throw new BadRequestException('Parece que as senhas digitadas não coincidem, tente novamente.');
  }
}
