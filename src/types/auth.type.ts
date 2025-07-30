import { IProfile } from '@/store/profileStore';
import { User as _PrivyUser } from '@privy-io/react-auth';

export interface IToken {
  Address: string;
  Nonce: number;
}
export type PrivyUser = _PrivyUser;
export type IProfileUser = Pick<
  IProfile,
  | "address"
  | "email"
  | "name"
  | "phoneNumber"
  | "idFrontImage"
  | "idBackImage"
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'id'
  | 'publicAddress'
  | 'nonce'
  | 'signedString'
  | 'referralCode'
  | 'invitedBy'
  | 'incomeEarned'
  | 'frens'
  | 'userType'
  | 'rankPoint'
> & {
  privyUser: PrivyUser;
  hasEAP: boolean;
  telegramId?: string;
};
