import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export interface IAnimTextProps {
  delay?: number;
  duration?: number;
  text: string;
  className?: string;
}

export default function TextFadeIn({
  delay = 0,
  duration = 2,
  className,
  text,
}: IAnimTextProps) {
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      delay,
      duration,
      ease: "linear",

      onComplete: () => {
        setDone(true);
      },
    });
    return controls.stop;
  }, []);

  return (
    <span>
      <motion.span className={className}>{displayText}</motion.span>
      {!done && <motion.span className={className}>_</motion.span>}
    </span>
  );
}
