import React from "react";

interface BrutalHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

const BrutalHeading = ({
  children,
  className = "",
  as: Component = "h2",
  ...props
}: BrutalHeadingProps) => {
  return (
    <Component
      className={`font-bold text-[#002C5B] uppercase tracking-tight relative ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default BrutalHeading;
