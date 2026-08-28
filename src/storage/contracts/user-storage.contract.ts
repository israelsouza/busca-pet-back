export type hasError = {
  message: string;
};

export interface emailAndNickname {
  email: string;
  nickname: string;
}

export interface Metadata {
  authorization: {
    roles: string[];
  };
}

export interface newUser {
  person: string;
  email: string;
  nickname: string;
  metadata: Metadata;
  type: 'LOCAL';
  password: string;
}

export interface CreatedUserResponse {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
}

export abstract class UserStorage {
  abstract checkEmailAndNickname(data: emailAndNickname): Promise<null | hasError>;
  abstract createLocalUser(data: newUser): Promise<CreatedUserResponse>;
}
