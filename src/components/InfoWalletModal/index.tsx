import { useCloseModal } from "@/hooks/useModal";
import { useClearProfile } from "@/hooks/useProfile";
import { copyAddress } from "@/utils/copy";
import { ellipsisCenter } from "@/utils/ellipsis";
import axios from "axios";
import { useAccount, useDisconnect } from "wagmi";

export default function InfoWalletModal() {
  const { connector, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const closeModal = useCloseModal();
  const clearProfile = useClearProfile();
  return (
    <div className="w-full flex flex-col gap-7">
      <div>Connect With {connector?.name}</div>
      <button className="h-12 w-full px-3 flex items-center bg-[#151515] border border-[#3C3C3C]">
        {ellipsisCenter({
          str: address || "",
          limit: 10,
        })}
      </button>
      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex gap-1 items-center">
          <ExploreSvg />
          <span className="text-base font-normal text-[#26C66E]">
            View on explorer
          </span>
        </div>
        <div
          onClick={() => {
            copyAddress(address || "");
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <CopyIcon />
          <span className="text-base font-normal text-[#26C66E]">
            Copy Address
          </span>
        </div>

        <button
          onClick={() => {
            disconnectAsync().then(() => {
              clearProfile();
              axios.defaults.headers.common["Authorization"] = ``;
              closeModal();
            });
          }}
          className="h-16 px-4 border border-[#26C66E] flex items-center justify-center"
        >
          <span className="text-base font-normal text-[#26C66E]">
            Disconnect
          </span>
        </button>
      </div>
    </div>
  );
}
const ExploreSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.9923 8.85586L12 1.16079C12 0.46893 11.5314 0 10.8323 0H3.13444C2.48143 0 1.99744 0.491992 1.99744 1.09161C1.99744 1.68354 2.4968 2.14478 3.12676 2.14478H5.97695L8.50448 2.05253L7.16005 3.24407L0.37644 10.0474C0.138284 10.2934 0 10.5778 0 10.87C0 11.4542 0.537772 12 1.12932 12C1.42125 12 1.70551 11.8693 1.95134 11.631L8.75032 4.83536L9.94878 3.49007L9.84123 5.93466V8.87124C9.84123 9.5016 10.3022 10.0013 10.9014 10.0013C11.5006 10.0013 11.9923 9.5016 11.9923 8.85586Z"
      fill="#26C66E"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.6875 0H3.9375C3.21262 0 2.625 0.587617 2.625 1.3125V2.625H1.3125C0.587617 2.625 0 3.21262 0 3.9375V12.6875C0 13.4124 0.587617 14 1.3125 14H10.0625C10.7874 14 11.375 13.4124 11.375 12.6875V11.375H12.6875C13.4124 11.375 14 10.7874 14 10.0625V1.3125C14 0.587617 13.4124 0 12.6875 0ZM9.89844 12.6875H1.47656C1.43305 12.6875 1.39132 12.6702 1.36055 12.6394C1.32979 12.6087 1.3125 12.5669 1.3125 12.5234V4.10156C1.3125 4.05805 1.32979 4.01632 1.36055 3.98555C1.39132 3.95478 1.43305 3.9375 1.47656 3.9375H2.625V10.0625C2.625 10.7874 3.21262 11.375 3.9375 11.375H10.0625V12.5234C10.0625 12.5669 10.0452 12.6087 10.0144 12.6394C9.98368 12.6702 9.94195 12.6875 9.89844 12.6875ZM12.5234 10.0625H4.10156C4.05805 10.0625 4.01632 10.0452 3.98555 10.0144C3.95478 9.98368 3.9375 9.94195 3.9375 9.89844V1.47656C3.9375 1.43305 3.95478 1.39132 3.98555 1.36055C4.01632 1.32979 4.05805 1.3125 4.10156 1.3125H12.5234C12.5669 1.3125 12.6087 1.32979 12.6394 1.36055C12.6702 1.39132 12.6875 1.43305 12.6875 1.47656V9.89844C12.6875 9.94195 12.6702 9.98368 12.6394 10.0144C12.6087 10.0452 12.5669 10.0625 12.5234 10.0625Z"
      fill="#26C66E"
    />
  </svg>
);
