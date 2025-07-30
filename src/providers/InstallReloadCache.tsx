import LogoSVG from "@/assets/svgs/logo.svg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import authSolApi from "@/services/authSol.service";
import { ProductStatusResponse } from "@/types/install-reload-cache.type";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function InstallReloadCache() {
  const [needReloadCache, setNeedReloadCache] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [textMaintenance, setTextMaintenance] = useState("");
  const [productResponse, setProductResponse] =
    useState<ProductStatusResponse | null>(null);

  const fetchProductStatus = debounce(async () => {
    const currentVersion = localStorage.getItem("app-version");
    try {
      const response = await authSolApi.checkProductStatus();
      setProductResponse(response);

      if (response.productStatus.status === 0) {
        setShowMaintenance(true);
        setTextMaintenance(response.productStatus.text);
      } else {
        setShowMaintenance(false);
        setTextMaintenance("");
      }

      if (!currentVersion && response.version.text) {
        localStorage.setItem("app-version", response.version.text);
      } else {
        const showClear = currentVersion !== response.version.text;
        setNeedReloadCache(showClear);
      }
    } catch (error) {
      console.error("fetchProductStatus error:", error);
      setShowMaintenance(false);
      setTextMaintenance("");
      setNeedReloadCache(false);
    }
  }, 1000);

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      if ("caches" in window) {
        const cacheNames = await Promise.race([caches.keys(), timeout(5000)]);
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if ("serviceWorker" in navigator) {
        const registrations = await Promise.race([
          navigator.serviceWorker.getRegistrations(),
          timeout(5000),
        ]);
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }

      if (productResponse?.version.text) {
        localStorage.setItem("app-version", productResponse.version.text);
      }
      await delay(500);
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear cache:", error);
      toast.error(
        "Unable to install the latest version. Please refresh the page to try again."
      );
    } finally {
      setIsLoading(false);
      setNeedReloadCache(false);
    }
  };

  useEffect(() => {
    fetchProductStatus();
  }, []);
  return (
    <>
      <AlertDialog open={showMaintenance} onOpenChange={setShowMaintenance}>
        <AlertDialogTrigger asChild>
          <div id="alert-dialog-scan-pause"></div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Notice</AlertDialogTitle>
            <AlertDialogDescription>
              {textMaintenance ?? "App is under maintenance"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Got it</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={needReloadCache}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-col items-start gap-2 text-start">
              <img
                src={LogoSVG}
                className="h-[37px] cursor-pointer text-start"
              />
              New app version available! Update now for the latest features
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-end gap-2">
            <AlertDialogAction
              onClick={handleClearCache}
              className="text-dark h-12"
            >
              {isLoading ? "Updating..." : "Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default InstallReloadCache;

export const timeout = (ms: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
