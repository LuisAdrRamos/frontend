import React from "react";
import clsx from "clsx";

export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx("p-4 h-full", className)} {...props}>
      {children}
    </div>
  );
}

export default CardContent;