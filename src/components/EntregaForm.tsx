import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface EntregaFormProps {
  onSubmit: (data: { colaborador: string; quantidade: number; local: 'TI' | 'Servidor' }) => void;
  maxQuantidade: { ti: number; servidor: number };
}

export function EntregaForm({ onSubmit, maxQuantidade }: EntregaFormProps) {
  const [colaborador, setColaborador] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [local, setLocal] = useState<'TI' | 'Servidor'>('TI');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ colaborador, quantidade, local });
    setColaborador('');
    setQuantidade(1);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Registrar Entrega</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Colaborador</label>
          <input
            type="text"
            value={colaborador}
            onChange={(e) => setColaborador(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Local</label>
          <select
            value={local}
            onChange={(e) => setLocal(e.target.value as 'TI' | 'Servidor')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="TI">Sala de TI</option>
            <option value="Servidor">Servidor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantidade</label>
          <input
            type="number"
            min="1"
            max={local === 'TI' ? maxQuantidade.ti : maxQuantidade.servidor}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <Send size={18} />
          Registrar Entrega
        </button>
      </div>
    </form>
  );
}