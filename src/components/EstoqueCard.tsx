import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface EstoqueCardProps {
  titulo: string;
  quantidade: number;
  onAdicionar: () => void;
  onRemover: () => void;
}

export function EstoqueCard({ titulo, quantidade, onAdicionar, onRemover }: EstoqueCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
      <div className="text-3xl font-bold text-center mb-4">{quantidade}</div>
      <div className="flex gap-2">
        <button
          onClick={onAdicionar}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          <Plus size={18} />
          Adicionar
        </button>
        <button
          onClick={onRemover}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          disabled={quantidade === 0}
        >
          <Minus size={18} />
          Remover
        </button>
      </div>
    </div>
  );
}