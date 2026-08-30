export interface EnvironmentServices {
  authorization: string;
  users: string;
}

export interface Environment {
  services: EnvironmentServices;
}
