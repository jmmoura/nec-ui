import { Role } from "./Role";

export interface User {
  id: number;
  username: string;
  territoryNumber: string;
  role: Role;
}
