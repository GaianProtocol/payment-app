export const copyAddress = (address: string) => {
  navigator.clipboard.writeText(address);
};
