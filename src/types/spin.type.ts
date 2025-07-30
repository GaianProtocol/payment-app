
export interface SpinResponse {
  activity: string;
  message: string;
  rewards: SpinReward;
  status: number;
}

export interface SpinReward {
  id: number;
  createdAt: string;
  tx: string;
  address: string;
  proof: string;
  index: number;
  status: number;
  Reward: string;
  points: number;
}

export interface CheckSpinResponse {
  data: SpinData;
  diff: number;
  message: string;
  status: number;
}

export interface SpinData {
  id: number;
  _: null;
  tx: string;
  address: string;
  nftId: number;
  reward: number;
  status: number;
  proof: string;
  err_count: number;
  random_code: string;
  point: string;
}

interface VoucherType {
  id: number;
  name: string;
  value: string;
}

export interface IReward {
  id: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  deletedAt: string | null;
  expiredAt: string; // ISO 8601 date string
  extendLink: string;
  code: string;
  pin: string;
  reward: string;
  status: number;
  voucherTypeId: number;
  voucherType: VoucherType;
}

export interface AccountTeleResponse {
  account: AccountTele
  message: string
  status: number
  userId: number
}

export interface AccountTele {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  isInGroup: boolean;
  status: string;
  joinedAt: string;
  leftAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  userId: number;
}