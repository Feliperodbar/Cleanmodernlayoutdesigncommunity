"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch@1.1.3";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-6 w-12 items-center rounded-full transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 p-1",
        // Explicit backgrounds for unchecked/checked states + border for contrast
        "data-[state=unchecked]:bg-white data-[state=unchecked]:border-border data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-600 shadow-sm",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block h-4 w-4 rounded-full ring-0 shadow border border-border transition-transform transform",
          // move thumb to the right when checked (slightly less to fit padding)
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
