import React from "react";
import clsx from "clsx";

function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-transform hover:scale-105",
        className
      )}
      style={{
        border: "1px solid #ccc",
        boxShadow: "0 4px 8px rgba(10, 10, 10, 0.78)",
        transition: "transform 0.3s ease",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;