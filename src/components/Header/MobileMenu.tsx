"use client";

import { Discord, Menu, X } from "@/assets/svgs";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import ConnectButton from "./ConnectButton";

interface MobileMenuProps {
  items: {
    name: string;
    path: string;
    items?: {
      name: string;
      path: string;
      icon: string;
    }[];
  }[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsOpen(false),
    onSwipedRight: () => setIsOpen(true),
  });

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-800 focus:outline-none"
      >
        <img src={Menu} alt="" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={handleOverlayClick}
        />
      )}

      <div
        {...swipeHandlers}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-white shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex w-full justify-between border-b p-4 ">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-800 focus:outline-none"
          >
            <img src={Menu} alt="" />
          </button>
          <ConnectButton />
        </div>

        <nav className="flex-1">
          {items.map((item) => (
            // <a
            //   key={item.path}
            //   href={item.path}
            //   className="rounded px-3 py-4 text-gray-700 hover:bg-gray-100 border-b flex justify-between"
            // >
            //   {item.name}
            //   <ChevronRight className="opacity-20" />
            // </a>

            <Accordion type="single" collapsible key={item.path}>
              <AccordionItem value={item.path}>
                <AccordionTrigger className="px-4">
                  <a href={item.path}> {item.name}</a>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  {item.items?.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      className="font-normal group flex w-full justify-between hover:bg-black/5 p-2 rounded-md items-center "
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <img src={subItem.icon} alt="" />
                        {subItem.name}
                      </div>
                      <ChevronRight className="w-4 h-4 " />
                    </a>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </nav>
        <div className="self-stretch flex justify-center items-center gap-4 h-14 border-t">
          <img src={Discord} alt="w-full h-full" />
          <img src={X} alt="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
