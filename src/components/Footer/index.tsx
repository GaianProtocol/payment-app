import { Telegram, X } from "@/assets/svgs";

export default function Footer() {
  return (
    // <div className="bg-black sticky top-0 z-10">
    //   <div
    //     className="mx-auto flex justify-center"
    //     style={{
    //       height: FOOTER_HEIGHT,
    //     }}
    //   >
    //     <div className="flex items-center">
    //       <span className="text-base font-normal text-white">
    //         Copyright by Gaian © Gaian 2024
    //       </span>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="w-full max-md:hidden h-fit px-2 md:px-20 py-2 bg-dark inline-flex justify-between items-center sticky overflow-hidden z-10 ">
        <div className="self-stretch flex justify-end items-center gap-3 md:gap-6 py-4">
          <div className="justify-start text-white text-xs md:text-base font-semibold">
            Terms of Use
          </div>
          <div className="justify-start text-white text-xs md:text-base font-semibold">
            Privacy policy
          </div>
          <div className="justify-start text-white text-xs md:text-base font-semibold">
            Documentation
          </div>
        </div>
        <div className="self-stretch flex justify-center items-center gap-4">
          <a
            href="https://t.me/+nhhc0rADb-tiNmU1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Telegram} alt="w-full h-full" />
          </a>
          <a
            href="https://x.com/Gaian_hq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={X} alt="w-full h-full" />
          </a>
        </div>
      </div>
      <div className="md:hidden pb-24"></div>
    </>
  );
}
