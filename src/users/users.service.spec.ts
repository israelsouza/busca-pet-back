import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UsersService } from './users.service';
import { UserStorage } from '@storage/contracts/user-storage.contract';
import { LocalUserDTO } from './schema e dto/user.dto';

// argon2 não tem default export: o service usa "import argon2 from 'argon2'"
// com esModuleInterop, isso mapeia para o módulo inteiro. Mockamos o hash diretamente.
jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_mock'),
  argon2id: 2,
}));

const makeLocalUserDTO = (overrides: Partial<LocalUserDTO> = {}): LocalUserDTO => ({
  personName: 'João Silva',
  email: 'joao@example.com',
  nickname: 'joaosilva',
  password: 'senha123',
  secund_password: 'senha123',
  ...overrides,
});

const mockUserStorage = {
  checkEmailAndNickname: jest.fn(),
  createLocalUser: jest.fn(),
};

const mockHttpService = {
  post: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UserStorage, useValue: mockUserStorage }, { provide: HttpService, useValue: mockHttpService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve ser instanciado corretamente', () => {
    expect(service).toBeDefined();
  });

  describe('registerLocalUser()', () => {
    describe('✅ Fluxo feliz', () => {
      it('deve registrar o usuário com sucesso e retornar a entidade criada', async () => {
        const dto = makeLocalUserDTO();
        const expectedEntity = {
          id: 'uuid-123',
          email: dto.email,
          nickname: dto.nickname,
          createdAt: new Date(),
        };

        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(of({ data: { roles: ['user:common'] } } as AxiosResponse));
        mockUserStorage.createLocalUser.mockResolvedValue(expectedEntity);

        const result = await service.registerLocalUser(dto);

        expect(result).toEqual(expectedEntity);
      });

      it('deve chamar checkEmailAndNickname com email e nickname corretos', async () => {
        const dto = makeLocalUserDTO();

        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(of({ data: { roles: ['user:common'] } } as AxiosResponse));
        mockUserStorage.createLocalUser.mockResolvedValue({ id: 'uuid-123' });

        await service.registerLocalUser(dto);

        expect(mockUserStorage.checkEmailAndNickname).toHaveBeenCalledWith({
          email: dto.email,
          nickname: dto.nickname,
        });
      });

      it('deve chamar createLocalUser com a senha já com hash e os dados corretos', async () => {
        const dto = makeLocalUserDTO();

        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(of({ data: { roles: ['user:common'] } } as AxiosResponse));
        mockUserStorage.createLocalUser.mockResolvedValue({ id: 'uuid-123' });

        await service.registerLocalUser(dto);

        expect(mockUserStorage.createLocalUser).toHaveBeenCalledWith(
          expect.objectContaining({
            email: dto.email,
            nickname: dto.nickname,
            person: dto.personName,
            type: 'LOCAL',
            password: 'hashed_password_mock',
            metadata: {
              authorization: { roles: ['user:common'] },
            },
          }),
        );
      });

      it('deve chamar o endpoint correto do serviço de autorização', async () => {
        const dto = makeLocalUserDTO();

        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(of({ data: { roles: ['user:common'] } } as AxiosResponse));
        mockUserStorage.createLocalUser.mockResolvedValue({ id: 'uuid-123' });

        await service.registerLocalUser(dto);

        expect(mockHttpService.post).toHaveBeenCalledWith(expect.stringContaining('/v1/authorization/initialPermissions'));
      });
    });

    describe('❌ Email ou nickname já existentes', () => {
      it('deve lançar ConflictException se email já está cadastrado', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue({
          message: 'Este e-mail já está cadastrado.',
        });

        await expect(service.registerLocalUser(dto)).rejects.toThrow(ConflictException);
      });

      it('deve lançar ConflictException com a mensagem correta', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue({
          message: 'Este e-mail já está cadastrado.',
        });

        await expect(service.registerLocalUser(dto)).rejects.toThrow('Este e-mail já está cadastrado.');
      });

      it('deve lançar ConflictException se nickname já está em uso', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue({
          message: 'Este apelido já está em uso.',
        });

        await expect(service.registerLocalUser(dto)).rejects.toThrow(ConflictException);
      });

      it('não deve chamar createLocalUser quando há conflito', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue({
          message: 'Este e-mail já está cadastrado.',
        });

        await expect(service.registerLocalUser(dto)).rejects.toThrow(ConflictException);
        expect(mockUserStorage.createLocalUser).not.toHaveBeenCalled();
      });
    });

    describe('❌ Senhas não coincidem', () => {
      it('deve lançar BadRequestException se as senhas são diferentes', async () => {
        const dto = makeLocalUserDTO({ secund_password: 'outra_senha_123' });
        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);

        await expect(service.registerLocalUser(dto)).rejects.toThrow(BadRequestException);
      });

      it('deve lançar BadRequestException com a mensagem correta', async () => {
        const dto = makeLocalUserDTO({ secund_password: 'outra_senha_123' });
        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);

        await expect(service.registerLocalUser(dto)).rejects.toThrow('Parece que as senhas digitadas não coincidem, tente novamente.');
      });

      it('não deve chamar createLocalUser quando as senhas não coincidem', async () => {
        const dto = makeLocalUserDTO({ secund_password: 'outra_senha_123' });
        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);

        await expect(service.registerLocalUser(dto)).rejects.toThrow(BadRequestException);
        expect(mockUserStorage.createLocalUser).not.toHaveBeenCalled();
      });
    });

    describe('❌ Serviço de autorização indisponível', () => {
      it('deve lançar ServiceUnavailableException se o serviço de autorização falhar', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(throwError(() => new Error('Connection refused')));

        await expect(service.registerLocalUser(dto)).rejects.toThrow(ServiceUnavailableException);
      });

      it('deve lançar ServiceUnavailableException com a mensagem correta', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(throwError(() => new Error('Connection refused')));

        await expect(service.registerLocalUser(dto)).rejects.toThrow('O serviço de autorização está temporariamente indisponível.');
      });

      it('não deve chamar createLocalUser quando o serviço de autorização está fora do ar', async () => {
        const dto = makeLocalUserDTO();
        mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
        mockHttpService.post.mockReturnValue(throwError(() => new Error('Connection refused')));

        await expect(service.registerLocalUser(dto)).rejects.toThrow(ServiceUnavailableException);
        expect(mockUserStorage.createLocalUser).not.toHaveBeenCalled();
      });
    });
  });
});
