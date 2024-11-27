import React from 'react';
import { EstoqueCard } from './components/EstoqueCard';
import { EntregaForm } from './components/EntregaForm';
import { HistoricoEntregas } from './components/HistoricoEntregas';
import { useInventory } from './hooks/useInventory';

function App() {
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Gerenciamento de Estoque de Notebooks
        </h1>
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EntregaForm
            onSubmit={handleEntrega}
            maxQuantidade={{ ti: inventory.ti, servidor: inventory.servidor }}
          />
          <HistoricoEntregas entregas={inventory.historico} />
        </div>
      </div>
    </div>
  );
}

export default App;