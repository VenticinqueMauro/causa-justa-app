import React from "react";
import Link from "next/link";

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "white" | "dark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

const BrutalButton = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  href,
  ...props
}: BrutalButtonProps) => {
  const baseStyles =
    "border-2 uppercase transition duration-200 font-bold tracking-wide shadow-brutal cursor-pointer hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none";
    
  const sizeStyles = {
    xs: "px-2 py-1 text-xs",
    sm: "px-4 py-1.5 text-sm",
    md: "px-8 py-2 text-sm",
    lg: "px-10 py-2.5 text-base",
    xl: "px-12 py-3 text-lg",
  };

  const variantStyles = {
    primary:
      "border-[#002C5B] bg-[#002C5B] text-white shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)]",
    secondary:
      "border-[#002C5B] bg-[#EDFCA7] text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)]",
    outline:
      "border-[#002C5B] bg-white text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)]",
    white:
      "border-white bg-white text-[#002C5B] shadow-[1px_1px_rgba(255,255,255,0.8),2px_2px_rgba(255,255,255,0.8),3px_3px_rgba(255,255,255,0.8),4px_4px_rgba(255,255,255,0.8),5px_5px_0px_0px_rgba(255,255,255,0.8)]",
    dark:
      "border-[#EDFCA7] bg-transparent text-[#EDFCA7] shadow-[1px_1px_#EDFCA7,2px_2px_#EDFCA7,3px_3px_#EDFCA7,4px_4px_#EDFCA7,5px_5px_0px_0px_#EDFCA7]",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  // Si se proporciona href, renderizar como Link
  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...(props as any)}>
        {children}
      </Link>
    );
  }

  // Si no hay href, renderizar como botón normal
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default BrutalButton;
