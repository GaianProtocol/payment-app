import { ReactNode } from "react";

export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full relative overflow-y-auto scrollHidden flex flex-col z-[2] flex-1"
      // style={{
      //   minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
      // }}
    >
      {children}
    </div>
  );
}
