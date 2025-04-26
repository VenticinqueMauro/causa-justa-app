'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, initialValue = '' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-0 md:mb-6">
      <div className="flex border-2 bg-white border-[#002C5B] shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
        <input
          type="text"
          placeholder="Buscar campañas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#002C5B] text-white px-3 sm:px-6 py-2.5 md:py-3 font-bold hover:bg-[#001C3B] transition-colors flex items-center justify-center"
          aria-label="Buscar campañas"
        >
          <Search size={18} className="sm:hidden" />
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
