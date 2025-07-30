import { ReactNode } from "react";

export default function LayoutContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full relative lg:px-0  min-h-screen flex flex-col">
      {children}
      {/* <Tab /> */}
    </div>
  );
}
