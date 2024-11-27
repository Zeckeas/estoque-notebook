import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import { Header } from '../components/Header';
import { EstoqueCard } from '../components/EstoqueCard';
import { EntregaForm } from '../components/EntregaForm';
import { useInventory } from '../hooks/useInventory';

export function Dashboard() {
  const navigate = useNavigate();
  const { inventory, loading, handleAdicionar, handleRemover, handleEntrega } = useInventory();
  const totalNotebooks = inventory.ti + inventory.servidor;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/historico')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <History size={18} />
            Ver Histórico de Entregas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EstoqueCard
            titulo="Sala de TI"
            quantidade={inventory.ti}
            onAdicionar={() => handleAdicionar('ti')}
            onRemover={() => handleRemover('ti')}
          />
          <EstoqueCard
            titulo="Servidor"
            quantidade={inventory.servidor}
            onAdicionar={() => handleAdicionar('servidor')}
            onRemover={() => handleRemover('servidor')}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total de Notebooks Disponíveis</h2>
          <p className="text-4xl font-bold text-blue-600">{totalNotebooks}</p>
        </div>

        <div className="max-w-md mx-auto">
          <EntregaForm
            onSubmit={handleEntrega}
            maxQuantidade={{ ti: inventory.ti, servidor: inventory.servidor }}
          />
        </div>
      </div>
    </div>
  );
}