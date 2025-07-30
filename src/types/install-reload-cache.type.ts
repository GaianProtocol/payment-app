export interface ProductStatusResponse {
  productStatus: {
    id: number;
    configId: number;
    itemId: string;
    balance: number;
    tokenBalance: number;
    text: string;
    status: number;
  };
  status: number;
  version: {
    id: number;
    configId: number;
    itemId: string;
    balance: number;
    tokenBalance: number;
    text: string;
    status: number;
  };
}