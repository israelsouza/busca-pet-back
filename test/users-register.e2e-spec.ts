/**
 * Fluxo de cadastro de usuário local
 *
 * Requisitos: 
 *   Supabase local deve estar rodando (pnpm supabase start),
 *   as migrações devem estar aplicadas.
 *
 * Limpeza: 
 *   Ao final de todos os testes, os usuários criados são removidos do banco.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/storage/prisma.service';
import { setupApp } from '../src/app/bootstrap';

const BASE_URL = '/api/v1/users/create/local';

const makeValidBody = (overrides: Record<string, unknown> = {}) => ({
  personName: 'Teste E2E',
  email: `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@buscapet.test`,
  nickname: `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  password: 'senhaForte123',
  secund_password: 'senhaForte123',
  ...overrides,
});

describe('POST /api/v1/users/create/local (E2E)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const createdEmails: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Limpeza
    if (createdEmails.length > 0) {
      await prisma.user.deleteMany({
        where: { email: { in: createdEmails } },
      });
    }
    await app.close();
  });

  describe('✅ Cenários de sucesso', () => {
    it('201 — deve criar usuário local com dados válidos', async () => {
      const body = makeValidBody();
      createdEmails.push(body.email);

      const response = await request(app.getHttpServer()).post(BASE_URL).send(body).expect(201);

      expect(response.body).toMatchObject(
        expect.objectContaining({
          email: body.email,
          nickname: body.nickname,
        }),
      );
    });

    it('201 — deve retornar os campos: id, email, nickname, createdAt', async () => {
      const body = makeValidBody();
      createdEmails.push(body.email);

      const response = await request(app.getHttpServer()).post(BASE_URL).send(body).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('nickname');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('❌ Validação de entrada (Zod)', () => {
    it('400 — deve rejeitar body com email inválido', async () => {
      const body = makeValidBody({ email: 'email-invalido' });

      await request(app.getHttpServer()).post(BASE_URL).send(body).expect(400);
    });

    it('400 — deve rejeitar body com nickname muito curto (< 3 chars)', async () => {
      const body = makeValidBody({ nickname: 'ab' });

      await request(app.getHttpServer()).post(BASE_URL).send(body).expect(400);
    });

    it('400 — deve rejeitar body com senha muito curta (< 8 chars)', async () => {
      const body = makeValidBody({ password: 'curta', secund_password: 'curta' });

      await request(app.getHttpServer()).post(BASE_URL).send(body).expect(400);
    });

    it('400 — deve rejeitar body sem o campo personName', async () => {
      const body = makeValidBody();
      const bodyWithoutPerson = Object.fromEntries(Object.entries(body).filter(([key]) => key !== 'personName'));

      await request(app.getHttpServer()).post(BASE_URL).send(bodyWithoutPerson).expect(400);
    });
  });

  describe('❌ Regras de negócio', () => {
    it('400 — deve retornar erro se as senhas não coincidem', async () => {
      const body = makeValidBody({ secund_password: 'senha_diferente_456' });

      await request(app.getHttpServer()).post(BASE_URL).send(body).expect(400);
    });

    it('409 — deve retornar ConflictException se o email já está cadastrado', async () => {
      const body = makeValidBody();
      createdEmails.push(body.email);

      // Primeiro cadastro — deve funcionar
      await request(app.getHttpServer()).post(BASE_URL).send(body).expect(201);

      // Segundo cadastro com o mesmo email e nickname diferente — deve falhar com 409
      const secondBody = {
        ...body,
        nickname: `outro_nick_${Date.now()}`,
      };

      await request(app.getHttpServer()).post(BASE_URL).send(secondBody).expect(409);
    });

    it('409 — deve retornar ConflictException se o nickname já está em uso', async () => {
      const body = makeValidBody();
      createdEmails.push(body.email);

      // Primeiro cadastro — deve funcionar
      await request(app.getHttpServer()).post(BASE_URL).send(body).expect(201);

      // Segundo cadastro com o mesmo nickname e email diferente — deve falhar com 409
      const secondBody = makeValidBody({ nickname: body.nickname });

      await request(app.getHttpServer()).post(BASE_URL).send(secondBody).expect(409);
    });
  });
});
