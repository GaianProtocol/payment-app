// PaymentInfo Component
import VietQR from "@/assets/images/viet-qr.png";
import Dropdown from "@/components/Dropdown";
import { Landmark } from "lucide-react";

export function PaymentInfo({
  paymentMethod,
  bankName,
  bankCode,
  accountNumber,
  beneficiaryName,
}: {
  paymentMethod: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  beneficiaryName: string;
}) {
  return (
    <div
      data-property-1="Recipient"
      className="w-full p-4 bg-white rounded-xl border border-[#e2e8ea] flex flex-col gap-3 relative overflow-hidden"
    >
      {paymentMethod === "vietqr" && (
        <div className="flex justify-between items-center">
          <div className="text-xs font-normal text-[#666666]">
            Payment Method
          </div>
          <div className="w-14 h-5 relative">
            <img className="absolute w-14 h-5" src={VietQR} alt="VietQR" />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="text-xs font-normal text-[#666666]">Bank</div>
        <div className="text-sm text-right font-medium text-[#1b1b1b] flex gap-1 items-center">
          {bankCode} <HintBankName bankName={bankName} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs font-normal text-[#666666]">
          Beneficiary account number
        </div>
        <div className="text-sm font-medium text-[#1b1b1b]">
          {accountNumber}
        </div>
      </div>
      {beneficiaryName && (
        <div className="flex justify-between items-center">
          <div className="text-xs font-normal text-[#666666]">Name</div>
          <div className="text-sm font-medium text-[#1b1b1b]">
            {beneficiaryName}
          </div>
        </div>
      )}
      <div className="absolute left-[3px] top-0 w-36 h-[3px] bg-[#9fe870] origin-top-left rotate-90" />
    </div>
  );
}

const HintBankName = ({ bankName }: { bankName: string }) => {
  return (
    <Dropdown
      className="rounded-xl"
      trigger={
        <div className="border p-1 rounded">
          <Landmark className="w-3 h-3" />
        </div>
      }
    >
      <div className="bg-white w-full h-full p-4 ">
        <div className="flex justify-between items-center">
          <div className="text-sm text-right font-medium text-[#1b1b1b]">
            {bankName}
          </div>
        </div>
      </div>
    </Dropdown>
  );
};
