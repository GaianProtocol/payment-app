export const PAYMENT_PHASES = ["none", "pending", "success"] as const;

export type ScanCodeProps = {
  paymentMethod: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  beneficiaryName: string;
  transactionAmount: string;
  countryCode: string;
};

export interface Payment {
  ID: number
  PaymentType: string
  TransactionID: string
  Amount: number
  Currency: string
  WalletAddress: string
  BankBIN: string
  Status: string
  CheckCount: number
  CreatedAt: string
}


export interface CryptoPayment {
  ID: number;
  PaymentType: string;
  TransactionID: string;
  Amount: number;
  Currency: string;
  WalletAddress: string;
  BankBIN: string;
  Status: string;
  CheckCount: number;
  CreatedAt: string;
}

interface BankPayment {
  ID: number;
  PaymentType: string;
  TransactionID: string;
  Amount: number;
  Currency: string;
  BankBIN: string;
  BankAccountName: string;
  BankAccountNumber: string;
  BankName: string;
  ContentPayment: string;
  QRURL: string;
  Status: string;
  CheckCount: number;
  CreatedAt: string;
}

interface FeesV2 {
  ID: number;
  SystemFee: number;
  ProcessingFee: number;
  CreatedAt: string;
  UpdatedAt: string;
}


export interface IInvoice {
  ID: number;
  InvoiceCode: string;
  V2QRCodeID: number;
  QRCode: QRCode;
  TokenAmount: number;
  FiatAmount: number;
  Status: string;
  StatusCrypto: string;
  StatusFiat: string;
  CryptoPaymentID: number;
  CryptoPayment: CryptoPayment;
  BankPaymentID: number;
  BankPayment: BankPayment;
  FeesIDV2: number;
  FeesV2: FeesV2;
  Point: number;
  CreatedAt: string;

}

export interface QRCode {
  ID: number;
  RawData: string;
  PayloadFormat: string;
  PointOfInitiation: string;
  BankBIN: string;
  BankName: string;
  BankAccountNumber: string;
  TransactionCurrency: string;
  CountryCode: string;
  MerchantName: string;
  MerchantCity: string;
  CRC: string;
  IsVietQR: boolean;
  CreatedAt: string;
}

export interface QrpayResponse {
  info: QRInfo
  message: any
  qrpay: Qrpay
  status: number
}
export interface Qrpay {
  Version: string
  initiation_method: string
  merchant_info: MerchantInfo
  currency_code: string
  amount: number
  tip_and_fee_type: string
  tip_and_fee_amount: number
  tip_and_fee_percent: number
  description: string
  addition_data: AdditionData
}

export interface MerchantInfo {
  name: string
  city: string
  country_code: string
  postal_code: string
  napas_provider: NapasProvider
  master_account: string
  visa_account: string
  jcb_account: string
  upi_account: string
  category_code: string
}

export interface NapasProvider {
  id: string
  bank_bin: string
  transfer_to: string
  method: string
}

export interface AdditionData { }

export interface Data {
  bankAccountNumber: string
  bankCode: string
  bankName: string
  amount: number
  countryCode: string
  recipientName: string
  qrType: string
  additionalData: AdditionalData
}
export interface QRInfo {
  success: boolean
  message: string
  data: Data
  errorCode: number
}

export interface AdditionalData {
  merchantMobileNumber: string
  merchantCity: string
  crcCode: string
  purpose: string
  mobileNumber: string
  tfrName: string
  tfrBnkCode: string
  userId: string
  paymentType: string
  customerLabel: string
  merchantCategoryCode: string
  tfrAcctNo: string
  postCode: string
  uniqueId: string
  loyaltyNumber: string
}

export interface CurrencyLimit {
  MinimunTranfer: number;
  MaxTranfer: number;
  TranferFee: number;
  FixedFee: number;
  MinimunFee: number;
}

export interface Limits {
  PHP: CurrencyLimit;
  VND: CurrencyLimit;
}

export interface RateGlobal {
  'USDC/PHP': number;
  'USDC/VND': number;
  limit: Limits;
  reciverAddress: string;
  status: number;
  taskList: unknown[];
}