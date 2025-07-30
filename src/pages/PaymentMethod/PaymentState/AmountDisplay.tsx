import { IInvoice } from "@/types/payment.type";
import { ITokenOption } from "@/types/swap.type";

export interface TransactionFormProps {
  onReset: () => void;
  invoice: IInvoice;
  token: ITokenOption;
}

// Component: Displays payment amounts
export function AmountDisplay({
  invoice,
  token,
}: {
  invoice: IInvoice;
  token: ITokenOption;
}) {
  return (
    <div className="flex flex-col justify-start items-center gap-1.5 self-stretch">
      <div className="flex flex-col justify-center items-center gap-3 self-stretch">
        <div className="flex flex-col justify-center items-center gap-2 self-stretch">
          <div className="inline-flex items-center gap-1">
            <div className="text-4xl font-semibold text-dark text-center">
              {invoice.BankPayment.Amount.toLocaleString("en-US", {
                maximumFractionDigits: 4,
                minimumFractionDigits: 0,
              })}
            </div>
            <div className="text-2xl font-semibold text-dark/40 text-center uppercase">
              {invoice.BankPayment.Currency}
            </div>
          </div>
        </div>
      </div>
      <div className="inline-flex justify-center items-center gap-2">
        <img src={token.logoURI} alt={token.name} />
        <div className="text-base font-medium leading-normal text-[#616566]">
          {invoice.TokenAmount.toLocaleString("en-US", {
            maximumFractionDigits: 4,
            minimumFractionDigits: 0,
          })}{" "}
          {token.symbol}
        </div>
      </div>
    </div>
  );
}
