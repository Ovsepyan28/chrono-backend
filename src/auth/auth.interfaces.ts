import { IUser } from 'src/users/users.interfaces';

export type PayloadForToken = {
  id: IUser['id'];
  email: IUser['email'];
  role: IUser['role'];
};

export type AuthRequest = {
  token: string;
};
