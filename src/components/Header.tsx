import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export function Header() {
  const { signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Sistema de Gerenciamento de Notebooks
        </h1>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </header>
  );
}