/**
 * Teste de INTEGRAÇÃO do UsersService.
 *
 * O módulo é montado com Test.createTestingModule usando HttpModule real,
 * mas substituímos apenas as dependências de infraestrutura (banco e HTTP externo).
 *
 * Objetivo: validar a orquestração entre as camadas sem acesso a banco ou serviços externos.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConflictException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UsersService } from './users.service';
import { UserStorage, newUser } from '@storage/contracts/user-storage.contract';
import { LocalUserDTO } from './schema e dto/user.dto';

jest.mock('argon2', () => ({
  hash: jest.fn((pass: string) => Promise.resolve(`hashed::${pass}`)),
  argon2id: 2,
}));

const makeLocalUserDTO = (overrides: Partial<LocalUserDTO> = {}): LocalUserDTO => ({
  personName: 'Ana Souza',
  email: 'ana@example.com',
  nickname: 'anasouza',
  password: 'minhasenha123',
  secund_password: 'minhasenha123',
  ...overrides,
});

describe('UsersService (integração)', () => {
  let service: UsersService;
  let httpService: HttpService;

  const mockUserStorage = {
    checkEmailAndNickname: jest.fn(),
    createLocalUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [UsersService, { provide: UserStorage, useValue: mockUserStorage }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('deve ser instanciado com todas as dependências injetadas', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('Orquestração do fluxo de cadastro', () => {
    it('deve fazer hash da senha antes de passar ao storage (nunca salva senha em texto puro)', async () => {
      const dto = makeLocalUserDTO();
      const senha = dto.password;

      mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
      mockUserStorage.createLocalUser.mockResolvedValue({ id: 'uuid-abc' });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { roles: ['user:common'] } } as AxiosResponse));

      await service.registerLocalUser(dto);

      const primeiraChamada = mockUserStorage.createLocalUser.mock.calls[0] as unknown[];
      const chamadaStorage = primeiraChamada[0] as newUser;
      expect(chamadaStorage.passwordHash).not.toBe(senha);
      expect(chamadaStorage.passwordHash).toContain('hashed::');
    });

    it('deve montar o newUserEntity com o formato correto (metadata.authorization)', async () => {
      const dto = makeLocalUserDTO();

      mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
      mockUserStorage.createLocalUser.mockResolvedValue({ id: 'uuid-abc' });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { roles: ['user:common'] } } as AxiosResponse));

      await service.registerLocalUser(dto);

      expect(mockUserStorage.createLocalUser).toHaveBeenCalledWith(
        expect.objectContaining({
          person: dto.personName,
          email: dto.email,
          nickname: dto.nickname,
          type: 'LOCAL',
          metadata: {
            authorization: {
              roles: ['user:common'],
            },
          },
        }),
      );
    });

    it('deve usar as roles retornadas pelo serviço de autorização no metadata', async () => {
      const dto = makeLocalUserDTO();
      const rolesCustom = ['user:common', 'beta:tester'];

      mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
      mockUserStorage.createLocalUser.mockResolvedValue({ id: 'uuid-abc' });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { roles: rolesCustom } } as AxiosResponse));

      await service.registerLocalUser(dto);

      const primeiraChamada = mockUserStorage.createLocalUser.mock.calls[0] as unknown[];
      const chamadaStorage = primeiraChamada[0] as newUser;
      expect(chamadaStorage.metadata.authorization.roles).toEqual(rolesCustom);
    });
  });

  describe('Propagação de erros na cadeia', () => {
    it('deve parar o fluxo no checkEmailAndNickname antes de chamar o serviço de auth', async () => {
      const dto = makeLocalUserDTO();
      const httpSpy = jest.spyOn(httpService, 'post');
      mockUserStorage.checkEmailAndNickname.mockResolvedValue({ message: 'Este e-mail já está cadastrado.' });

      await expect(service.registerLocalUser(dto)).rejects.toThrow(ConflictException);
      expect(httpSpy).not.toHaveBeenCalled();
    });

    it('deve parar o fluxo na validação de senhas antes de chamar o serviço de auth', async () => {
      const dto = makeLocalUserDTO({ secund_password: 'senha_diferente' });
      const httpSpy = jest.spyOn(httpService, 'post');
      mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);

      await expect(service.registerLocalUser(dto)).rejects.toThrow(BadRequestException);
      expect(httpSpy).not.toHaveBeenCalled();
    });

    it('deve lançar ServiceUnavailableException se o endpoint de auth retornar erro HTTP', async () => {
      const dto = makeLocalUserDTO();
      mockUserStorage.checkEmailAndNickname.mockResolvedValue(null);
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => ({ response: { status: 500 }, message: 'Internal Server Error' })));

      await expect(service.registerLocalUser(dto)).rejects.toThrow(ServiceUnavailableException);
      expect(mockUserStorage.createLocalUser).not.toHaveBeenCalled();
    });
  });
});
