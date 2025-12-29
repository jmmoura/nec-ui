import { User } from "./User";

export interface Authentication {
  accessToken: string;
  tokenType: string;
  expiresIn: number | null;
  user: User | null;
}
