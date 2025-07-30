import { connection } from "@/utils/config";

export const useCheckValidTime = () => {

  const getLatestBlockTimestamp = async (): Promise<number | null> => {
    const latestSlot = await connection.getSlot();
    const blockTime = await connection.getBlockTime(latestSlot);
    return blockTime;
  };

  const checkTimeValidity = async () => {
    const blockTimestamp = await getLatestBlockTimestamp();
    if (!blockTimestamp) {
      throw new Error("Failed to get latest block timestamp");
    }

    const blockTime = new Date(blockTimestamp * 1000);
    const hours = (blockTime.getUTCHours() + 7) % 24; // Adjust for GMT+7
    const minutes = blockTime.getUTCMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Check if the current time is between 8:00 AM and 6:00 PM
    if (totalMinutes >= 480 && totalMinutes < 1080) {
      return true;
    } else {
      return false;
    }
  };
  const checkTimeLocalValidity = async () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes < 480 || totalMinutes >= 1320) {
      return false;
    }

    return true;
  };

  return { checkTimeValidity, checkTimeLocalValidity };
};