"use client";

import { SpinWheel } from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface FloatIconProps {
  onClick?: () => void;
}

interface Position {
  x: number;
  y: number;
}

export function FloatIcon({ onClick }: FloatIconProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });

  // Handle drag start (mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Handle drag move (mouse)
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      e.preventDefault(); // Prevent default behaviors like text selection
      const newX = e.clientX - offsetRef.current.x;
      const newY = e.clientY - offsetRef.current.y;

      // Constrain within window bounds
      const maxX = window.innerWidth - dragRef.current.offsetWidth;
      const maxY = window.innerHeight - dragRef.current.offsetHeight;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  // Handle drag end (mouse)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle drag start (touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (dragRef.current) {
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  // Handle drag move (touch)
  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && dragRef.current) {
      e.preventDefault(); // Prevent page scrolling
      const touch = e.touches[0];
      const newX = touch.clientX - offsetRef.current.x;
      const newY = touch.clientY - offsetRef.current.y;

      // Constrain within window bounds
      const maxX = window.innerWidth - dragRef.current.offsetWidth;
      const maxY = window.innerHeight - dragRef.current.offsetHeight;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  // Handle drag end (touch)
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add/remove touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  // Set initial position to bottom: 100px, right: 100px and handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: window.innerWidth - 60 - 20, // 60: button size, 100: right margin
        y: window.innerHeight - 60 - 100, // 60: button size, 100: bottom margin
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial position
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={dragRef}
      className={cn(
        "fixed z-20 flex flex-col items-center gap-2 transition-transform duration-200 touch-none", // Prevent touch scrolling
        isDragging && "cursor-grabbing"
      )}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative w-12 h-12">
        <Button
          className="rounded-full p-0 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground shadow-xl hover:bg-primary/90"
          onClick={onClick}
        >
          <img src={SpinWheel} className="w-6 h-6" alt="Spin Wheel" />
        </Button>
        <X
          className="w-4 h-4 absolute -top-3 -right-3 cursor-pointer"
          onClick={() => setIsVisible(false)}
        />
      </div>
    </div>
  );
}
