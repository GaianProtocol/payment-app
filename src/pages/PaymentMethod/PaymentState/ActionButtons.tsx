import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths.route";
import { useNavigate } from "react-router-dom";
export function ActionButtons() {
  const navigator = useNavigate();
  return (
    <div className="flex flex-col justify-start items-start gap-2.5 self-stretch">
      {/* <a
        href={`https://solscan.io/tx/${tx}`}
        target="_blank"
        className="w-full"
      >
        <Button
          className={cn(
            "w-full py-4 rounded-full",
            status === PAYMENT_PHASES[1] &&
              "bg-primary-darker hover:bg-primary-dark text-[#d3f4bd]",
            status === PAYMENT_PHASES[2] && "bg-transparent border text-dark"
          )}
        >
          View on blockchain explorer
        </Button>
      </a> */}
      {/* {status === PAYMENT_PHASES[2] && (
        <Button
          className={cn(
            "w-full py-4 rounded-full bg-primary-darker hover:bg-primary-dark text-[#d3f4bd]"
          )}
          onClick={onReset}
        >
          <img src={ScanBarcode} className="invert" alt="" /> Scan new QR Code
        </Button>
      )} */}
      <div
        onClick={() => {
          navigator(ROUTES.DASHBOARD);
        }}
        className="w-full"
      >
        <Button className="w-full py-4 bg-transparent shadow-none text-dark rounded-full">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
