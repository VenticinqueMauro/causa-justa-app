import React from "react";

interface BrutalSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "alt" | "dark";
  className?: string;
}

const BrutalSection = ({
  children,
  className = "",
  variant = "default",
  ...props
}: BrutalSectionProps) => {
  const variantStyles = {
    default: "bg-[#ECECE2]",
    alt: "bg-gray-100",
    dark: "bg-[#002C5B] text-white",
  };

  return (
    <section className={`py-16 ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </section>
  );
};

export default BrutalSection;
