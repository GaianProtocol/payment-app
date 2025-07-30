"use client";

import napas from "@/assets/images/napas.png";
import VietQR from "@/assets/images/viet-qr.png";
import { cn } from "@/utils/cn";
import { Scanner } from "@yudiel/react-qr-scanner";
import jsQR from "jsqr";
import { Images } from "lucide-react";
import { useRef } from "react";

interface QRScannerProps {
  onScan: (result: string | null) => void;
  onError: (error: any) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onError, onClose }: QRScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onError("Failed to get canvas context");
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          onScan(code.data);
        } else {
          onError("No QR code found in the image");
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999]",
        "bg-black/80",
        "flex flex-col items-center justify-center"
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl font-light"
      >
        ✕
      </button>
      <div className="text-white text-xl font-semibold mb-4 absolute top-8 left-1/2 -translate-x-1/2 ">
        Scan QR Code
      </div>
      <div className="flex items-center gap-4 mb-2">
        <img src={VietQR} alt="" className="h-6 pb-1" />
        <img src={napas} alt="" className="h-5" />
      </div>
      <div className="relative w-72 h-72 p-3">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <Scanner
            onScan={(result) => onScan(result[0].rawValue)}
            onError={onError}
            components={{
              zoom: true,
              finder: false,
            }}
          />
        </div>
        {/* Frame Borders */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-3xl " />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-3xl " />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-3xl " />
      </div>
      <div className="text-white bg-black px-2 py-1 rounded-md text-sm mt-3">
        Move your camera so that the QR Code fits into the frame.
      </div>

      {/* Button and input for scanning from image */}
      <div className="mt-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm rounded-md text-white shadow-none bg-transparent flex items-center gap-2"
        >
          <Images className="w-4 h-4" color="white" />
          Choose from Photos
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
