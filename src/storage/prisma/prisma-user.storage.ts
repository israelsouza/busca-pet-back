import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { emailAndNickname, hasError, UserStorage, newUser, CreatedUserResponse } from '../contracts/user-storage.contract';

@Injectable()
export class PrismaUserStorage implements UserStorage {
  constructor(private readonly prisma: PrismaService) {}

  async checkEmailAndNickname(data: emailAndNickname): Promise<null | hasError> {
    const hasUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            nickname: data.nickname,
          },
        ],
      },
    });

    if (hasUser) {
      if (hasUser.email === data.email) return { message: 'Este e-mail já está cadastrado.' };
      if (hasUser.nickname === data.nickname) return { message: 'Este apelido já está em uso.' };
    }

    return null;
  }

  async createLocalUser(data: newUser): Promise<CreatedUserResponse> {
    const { type, passwordHash, email, metadata, nickname, person } = data;

    return await this.prisma.user.create({
      data: {
        person: {
          create: {
            name: person,
          },
        },
        metadata: metadata as unknown as Prisma.InputJsonObject,
        email,
        nickname,
        authMethods: {
          create: {
            type,
            localAuth: {
              create: {
                password: passwordHash,
              },
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }
}
