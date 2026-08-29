import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorizationService],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('deve ser instanciado corretamente', () => {
    expect(service).toBeDefined();
  });

  describe('createInitialPermissions()', () => {
    it('deve retornar um objeto com a role "user:common"', () => {
      const result = service.createInitialPermissions();
      expect(result).toEqual({ roles: ['user:common'] });
    });

    it('deve retornar um objeto com a propriedade "roles" sendo um array', () => {
      const result = service.createInitialPermissions();
      expect(Array.isArray(result.roles)).toBe(true);
    });

    it('deve sempre incluir "user:common" como role padrão', () => {
      const result = service.createInitialPermissions();
      expect(result.roles).toContain('user:common');
    });

    it('deve retornar o mesmo valor em chamadas consecutivas (idempotente)', () => {
      const first = service.createInitialPermissions();
      const second = service.createInitialPermissions();
      expect(first).toEqual(second);
    });
  });
});
