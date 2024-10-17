"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useAnimate, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";

const useTooltipAnimations = (hover: boolean) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "span",
      hover
        ? { top: -50, opacity: 1, scale: 1 }
        : { top: -20, opacity: 0, scale: 0 },
      {
        type: "spring",
        bounce: 0,
        duration: .35
      }
    );

  }, [animate, hover])
  return scope
}

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  magnification?: number;
  distance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
  " mx-auto mt-8 flex h-[58px] w-max gap-2 rounded-2xl border p-2 bg-background",
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      direction = "bottom",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DockIcon) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            magnification: magnification,
            distance: distance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: any;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
  tooltip: string;
  link?: string;
}

const DockIcon = ({
  size,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  link,
  children,
  tooltip,
  ...props
}: DockIconProps) => {
  const [isHover, setIsHover] = useState(false)

  const scope = useTooltipAnimations(isHover)
  const ref = useRef<HTMLDivElement>(null);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40],
  );

  let width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      <div className="flex relative justify-center" ref={scope}>
        <Link href={link || ""}>
          {children}
        </Link>
        <motion.span initial={{ top: 0, opacity: 0, scale: 0 }} className={cn("text-nowrap absolute z-[1000] bg-[#fbfbfb] dark:bg-[#151517] text-xs -top-10 p-1 px-2 border rounded-lg")}>
          {tooltip}
        </motion.span>
      </div>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
