import React from "react";
import Link from "next/link";

interface BrutalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  className?: string;
}

const BrutalLink = ({
  href = "#",
  children,
  className = "",
  ...props
}: BrutalLinkProps) => {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium text-[#002C5B] transition-all duration-200 
                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#002C5B] 
                 after:transition-all after:duration-200 hover:after:w-full ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default BrutalLink;
