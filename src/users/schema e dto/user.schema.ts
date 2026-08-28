import { z } from 'zod';
import { email, nickname, password, personName, roles } from './user.shared';

const metadata = z.object({
  authorization: z.object({
    roles: roles,
  }),
});

export const localUserSchema = z.object({
  personName,
  email,
  password,
  secund_password: password,
  nickname,
});
export type localUserType = z.infer<typeof localUserSchema>;

export const newLocalUserEntity = z.object({
  person: personName,
  email,
  nickname,
  metadata,
  type: z.literal('LOCAL'),
  password: password,
});
export type newUserType = z.infer<typeof newLocalUserEntity>;
