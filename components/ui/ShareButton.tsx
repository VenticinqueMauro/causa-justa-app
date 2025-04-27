'use client';

import { Check, Facebook, Link, MessageCircle, Share2Icon, Twitter } from 'lucide-react';
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
      icon: <Facebook size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
    },
    {
      name: 'X',
      icon: <Twitter size={18} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#000000',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={18} />,
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
