import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LocalUserDTO } from './schema e dto/user.dto';

const makeLocalUserDTO = (overrides: Partial<LocalUserDTO> = {}): LocalUserDTO => ({
  personName: 'João Silva',
  email: 'joao@example.com',
  nickname: 'joaosilva',
  password: 'senha123',
  secund_password: 'senha123',
  ...overrides,
});

const mockUsersService = {
  registerLocalUser: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('deve ser instanciado corretamente', () => {
    expect(controller).toBeDefined();
  });

  describe('registerLocal()', () => {
    it('deve chamar usersService.registerLocalUser com os dados do body', async () => {
      const dto = makeLocalUserDTO();
      const expectedResult = { id: 'uuid-123', email: dto.email, nickname: dto.nickname };
      mockUsersService.registerLocalUser.mockResolvedValue(expectedResult);

      await controller.registerLocal(dto);

      expect(mockUsersService.registerLocalUser).toHaveBeenCalledTimes(1);
      expect(mockUsersService.registerLocalUser).toHaveBeenCalledWith(dto);
    });

    it('deve retornar o resultado do service', async () => {
      const dto = makeLocalUserDTO();
      const expectedResult = { id: 'uuid-123', email: dto.email, nickname: dto.nickname };
      mockUsersService.registerLocalUser.mockResolvedValue(expectedResult);

      const result = await controller.registerLocal(dto);

      expect(result).toEqual(expectedResult);
    });

    it('deve propagar ConflictException lançada pelo service', async () => {
      const dto = makeLocalUserDTO();
      mockUsersService.registerLocalUser.mockRejectedValue(new ConflictException('Este e-mail já está cadastrado.'));

      await expect(controller.registerLocal(dto)).rejects.toThrow(ConflictException);
    });

    it('deve propagar BadRequestException lançada pelo service', async () => {
      const dto = makeLocalUserDTO({ secund_password: 'senha_errada' });
      mockUsersService.registerLocalUser.mockRejectedValue(
        new BadRequestException('Parece que as senhas digitadas não coincidem, tente novamente.'),
      );

      await expect(controller.registerLocal(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
