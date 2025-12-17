import { Address } from "./Address";

export interface BlockDetails {
  id: number;
  name: string;
  addressList?: Address[];
}
