import { axios } from ".";

export type QRResponse = any
const fetchInfoQR = async (
  rawData: string,
): Promise<QRResponse> => {
  const data = {
    Text: rawData
  };

  const res: any = await axios.post(`/invoice/v2/scanqr`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // const res: any = fetch(
  //   `https://api.alixpay.com/api/v2/public/get-qr-code-info?qrContent=${rawData}`
  // ).then((res) => res.json());

  return res;
};

const createInvoice = async (
  rawData: string,
  amount: number,
  token: string = "USDC",
  countryCode: string
) => {
  const data = {
    text: rawData,
    amount,
    token,
    countryCode
  };

  const res: any = await axios.post(`/invoice/create2`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const updateCrytoTx = async (
  tx: string,
  invoiceId: number,
  InvoiceCode: string
) => {
  const data = {
    tx,
    invoiceId,
    fiatProof: "",
    InvoiceCode
  };

  const res: any = await axios.post(`/invoice/updateCryptoTx`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const updateFiatProof = async (
  invoiceId: number,
) => {
  const data = {
    tx: "",
    invoiceId,
    fiatProof: ""
  };

  const res: any = await axios.post(`/invoice/updateFiatProof`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}


const getInvoice = async (
  invoiceId: number,
) => {

  const res: any = await axios.get(`/invoice/${invoiceId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const getRateUSD = async () => {
  const res: any = await axios.get(`/global`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const getInvoiceHistories = async (offset: number, limit: number) => {
  const res: any = await axios.get(`/invoice/list/${limit}/${offset}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const getLastInvoices = async () => {
  const res: any = await axios.get(`/invoice/last100`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const paymentService = {
  createInvoice,
  fetchInfoQR,
  updateCrytoTx,
  getInvoice,
  getLastInvoices,
  updateFiatProof,
  getInvoiceHistories,
  getRateUSD
};

export default paymentService;
