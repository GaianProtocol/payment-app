import { Explore } from "@/assets/svgs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CryptoPayment, IInvoice } from "@/types/payment.type";
import { PAYMENT_STATUS } from "@/utils/constant";
import { calcUSDCWithFee } from "@/utils/utils";
import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ProgressSteps } from "./ProgressSteps";
import { RowField, RowFieldProps } from "./RowField";
export function TransactionProgress({
  stepProgress,
  tx,
  address,
  invoice,
}: {
  stepProgress: number;
  tx: string;
  address: string;
  invoice: IInvoice;
}) {
  const failStep = useMemo(() => {
    if (invoice.CryptoPayment.Status === PAYMENT_STATUS.FAILED) {
      return 1;
    }
    if (invoice.BankPayment.Status === PAYMENT_STATUS.FAILED) {
      return 2;
    }
    return 0;
  }, [invoice]);
  return (
    <div className="bg-white rounded-2xl flex flex-col justify-start items-center p-4 gap-4 border w-full">
      <div className="text-sm font-semibold border-b pb-4 w-full text-center">
        Transaction Progress
      </div>
      <div className="flex w-full gap-4 min-h-full">
        <ProgressSteps stepProgress={stepProgress} failStep={failStep} />
        <DetailsAccordion tx={tx} address={address} invoice={invoice} />
      </div>
    </div>
  );
}

function DetailsAccordion({
  tx,
  address,
  invoice,
}: {
  tx: string;
  address: string;
  invoice: IInvoice;
}) {
  const [openItem, setOpenItem] = useState<string | undefined>(`item-1`);

  const handleValueChange = (value: string) => {
    setOpenItem(value || undefined);
  };

  // useEffect(() => {
  //   if (stepProgress === 1) {
  //     handleValueChange(`item-1`);
  //   } else {
  //     handleValueChange(`item-2`);
  //   }
  // }, [stepProgress]);

  return (
    <div className="flex flex-col justify-start items-start gap-4 self-stretch flex-1">
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={handleValueChange}
        className="w-full"
      >
        <AccordionItem value="item-1" className="mb-2">
          <AccordionTrigger className="hover:no-underline w-full pt-0 px-0 pb-2">
            <div className="flex flex-col">
              <div>Payer Transaction</div>
              <div className="text-xs text-dark/40">
                Your transaction process
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CryptoTransferDetails
              tx={tx}
              address={address}
              memo={invoice.InvoiceCode}
              fee={
                calcUSDCWithFee(invoice.TokenAmount).fee.toString() +
                " " +
                invoice.CryptoPayment.Currency
              }
              cryptoPayment={invoice.CryptoPayment}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-none">
          <AccordionTrigger className="hover:no-underline w-full pt-0 px-0 pb-0">
            <div className="flex flex-col">
              <div>Fiat is sending to receiver</div>
              <div className="text-xs text-dark/40">
                Await for fiat transferring
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <FiatTransferDetails invoice={invoice} />
          </AccordionContent>
        </AccordionItem>
        {/* <div className="flex flex-col">
          <div className="text-sm font-medium">Completed</div>
          <div className="text-xs text-dark/40">
            The payment has been successfully processed.
          </div>
        </div> */}
      </Accordion>
    </div>
  );
}

// Component: Crypto transfer details
function CryptoTransferDetails({
  tx,
  address,
  memo,
  fee,
  cryptoPayment,
}: {
  tx: string;
  address: string;
  memo: string;
  fee: string;
  cryptoPayment: CryptoPayment;
}) {
  return (
    <div className="flex flex-col rounded-md gap-1 bg-black/5 p-4 py-2">
      <RowField
        label="To address"
        value={`${address.slice(0, 5)}...${address.slice(-5)}`}
        extra={
          <Copy
            className="cursor-pointer"
            size={16}
            onClick={() =>
              navigator.clipboard.writeText(address).then(() => {
                toast.success("Copied to clipboard");
              })
            }
          />
        }
        border={true}
      />

      <RowField
        label="Transaction"
        value={`${tx.slice(0, 5)}...${tx.slice(-5)}`}
        extra={
          tx && (
            <div className="flex gap-2 items-center">
              <a
                href={`https://solscan.io/tx/${tx}`}
                target="_blank"
                className="p-1 border bg-white rounded-md"
              >
                <img
                  src={Explore}
                  alt="Explore"
                  className="w-3 h-3 cursor-pointer"
                />
              </a>
              <Copy
                className="cursor-pointer"
                size={16}
                onClick={() =>
                  navigator.clipboard.writeText(tx).then(() => {
                    toast.success("Copied to clipboard");
                  })
                }
              />
            </div>
          )
        }
        border={true}
      />
      <RowField
        label="Memo"
        value={memo}
        border={true}
        extra={
          <Copy
            className="cursor-pointer"
            size={16}
            onClick={() =>
              navigator.clipboard.writeText(memo).then(() => {
                toast.success("Copied to clipboard");
              })
            }
          />
        }
      />
      <RowField
        label="Processing fee"
        value={fee}
        extra={
          <Copy
            className="cursor-pointer"
            size={16}
            onClick={() =>
              navigator.clipboard.writeText(address).then(() => {
                toast.success("Copied to clipboard");
              })
            }
          />
        }
        border={true}
      />
      <RowField
        label="Status"
        value={getStatus(cryptoPayment.Status)}
        border={false}
      />
    </div>
  );
}

const getStatus = (status: string) => {
  let textStatus = "";
  switch (status) {
    case PAYMENT_STATUS.AWAITING_PAYMENT:
      textStatus = "Awaiting payment";
      break;
    case PAYMENT_STATUS.SUCCESS:
      textStatus = "Success";
      break;
    case PAYMENT_STATUS.FAILED:
      textStatus = "Failed";
      break;
    case PAYMENT_STATUS.REFUND:
      textStatus = "Refunding";
      break;
    case PAYMENT_STATUS.REFUNDED:
      textStatus = "Refunded";
      break;
    default:
      break;
  }

  return textStatus;
};

// Component: Fiat transfer details
function FiatTransferDetails({ invoice }: { invoice: IInvoice }) {
  const formattedTime = new Date(invoice.CreatedAt).toLocaleString();
  const rows: RowFieldProps[] = [
    {
      label: "Bank",
      value: invoice.QRCode.BankName,
      border: true,
      extra: (
        <Copy
          className="cursor-pointer"
          size={16}
          onClick={() =>
            navigator.clipboard.writeText(invoice.QRCode.BankName).then(() => {
              toast.success("Copied to clipboard");
            })
          }
        />
      ),
    },
    {
      label: "Account number",
      value: invoice.QRCode.BankAccountNumber,
      border: true,
      extra: (
        <Copy
          className="cursor-pointer"
          size={16}
          onClick={() =>
            navigator.clipboard
              .writeText(invoice.QRCode.BankAccountNumber)
              .then(() => {
                toast.success("Copied to clipboard");
              })
          }
        />
      ),
    },
    {
      label: "Time",
      value: formattedTime,
      border: true,
      extra: (
        <Copy
          className="cursor-pointer"
          size={16}
          onClick={() =>
            navigator.clipboard.writeText(formattedTime).then(() => {
              toast.success("Copied to clipboard");
            })
          }
        />
      ),
    },
    {
      label: "Status",
      value: getStatus(invoice.BankPayment.Status),
      border: false,
    },
  ];

  return (
    <div className="flex flex-col rounded-md gap-1 bg-dark/5 p-4 py-2">
      {rows.map((row, idx) => (
        <RowField
          key={idx}
          label={row.label}
          value={row.value}
          extra={row.extra}
          border={row.border}
        />
      ))}
    </div>
  );
}
