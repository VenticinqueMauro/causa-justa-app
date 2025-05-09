import React, { forwardRef, ForwardedRef } from "react";

interface BrutalSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "alt" | "dark";
  className?: string;
}

const BrutalSection = forwardRef<HTMLElement, BrutalSectionProps>(
  ({ children, className = "", variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-[#ECECE2]",
      alt: "bg-gray-100",
      dark: "bg-[#002C5B] text-white",
    };

    return (
      <section 
        ref={ref} 
        className={`py-8 ${variantStyles[variant]} ${className}`} 
        {...props}
      >
        {children}
      </section>
    );
  }
);

// Añadir displayName para mejorar la depuración
BrutalSection.displayName = "BrutalSection";

export default BrutalSection;
