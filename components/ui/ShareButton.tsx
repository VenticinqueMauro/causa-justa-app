'use client';

import { Check, Link, Share2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function ShareButton({ url, title, description = '', className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="currentColor"/>
          <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z" fill="white"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
    },
    {
      name: 'X',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#000000',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M20.463 3.488C18.217 1.24 15.231 0.001 12.05 0C5.495 0 0.16 5.334 0.157 11.892C0.156 13.988 0.683 16.035 1.686 17.855L0.0664 24L6.335 22.411C8.08 23.316 10.042 23.79 12.042 23.791H12.05C18.603 23.791 23.939 18.456 23.943 11.899C23.944 8.726 22.709 5.736 20.463 3.488ZM12.05 21.785H12.043C10.265 21.784 8.523 21.331 6.994 20.471L6.633 20.262L2.876 21.194L3.826 17.534L3.598 17.16C2.653 15.571 2.16 13.754 2.161 11.893C2.164 6.443 6.602 2.006 12.057 2.006C14.71 2.007 17.195 3.023 19.068 4.897C20.94 6.772 21.954 9.258 21.953 11.913C21.95 17.364 17.512 21.8 12.05 21.785Z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M9.073 6.925C8.853 6.438 8.622 6.426 8.41 6.415C8.237 6.407 8.039 6.407 7.842 6.407C7.645 6.407 7.327 6.48 7.06 6.773C6.792 7.066 6.006 7.803 6.006 9.295C6.006 10.788 7.084 12.232 7.231 12.429C7.379 12.627 9.32 15.718 12.339 17.001C14.845 18.067 15.358 17.87 15.9 17.821C16.443 17.772 17.689 17.084 17.934 16.395C18.179 15.705 18.179 15.114 18.105 14.991C18.031 14.868 17.835 14.795 17.54 14.648C17.245 14.501 15.753 13.764 15.485 13.666C15.217 13.568 15.02 13.519 14.824 13.812C14.627 14.106 14.042 14.795 13.869 14.991C13.697 15.188 13.525 15.213 13.23 15.065C12.935 14.918 11.958 14.599 10.794 13.568C9.882 12.76 9.271 11.762 9.099 11.469C8.926 11.176 9.081 11.016 9.229 10.87C9.362 10.739 9.525 10.529 9.673 10.357C9.82 10.184 9.869 10.062 9.967 9.865C10.066 9.668 10.017 9.496 9.943 9.349C9.869 9.201 9.277 7.698 9.073 6.925Z" fill="currentColor"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
    },
  ];

  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    });
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Compartir esta campaña"
        className="border-2 uppercase transition duration-200 font-bold tracking-wide shadow-brutal cursor-pointer hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none border-[#002C5B] bg-[#EDFCA7] text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)] p-2 flex items-center gap-2"
      >
        <Share2Icon size={18} />
        <span className="hidden md:inline">Compartir</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 mb-2 w-auto bg-transparent z-50 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  window.open(link.url, '_blank');
                  setIsOpen(false);
                }}
                className="flex items-center bg-white justify-center border-2 uppercase transition duration-200 font-bold tracking-wide shadow-brutal cursor-pointer hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none border-[#002C5B] text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)] p-2"
                title={link.name}
                style={{ color: link.color }}
              >
                {link.icon}
              </button>
            ))}
            <button
              onClick={copyToClipboard}
              className="flex items-center bg-white justify-center border-2 uppercase transition duration-200 font-bold tracking-wide shadow-brutal cursor-pointer hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none border-[#002C5B] text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)] p-2"
              title={copied ? 'Enlace copiado' : 'Copiar enlace'}
              disabled={copied}
            >
              {copied ? <Check size={18} className="text-green-600" /> : <Link size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
