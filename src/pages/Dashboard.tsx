import React, { useState } from 'react';
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

  const [isModalOpen, setIsModalOpen] = useState(false);  // Controla o estado do modal
  const [actionType, setActionType] = useState<'adicionar' | 'remover' | null>(null);
  const [local, setLocal] = useState<'ti' | 'servidor' | null>(null);
  const [quantity, setQuantity] = useState(1);  // Para controlar a quantidade no modal

  const openModal = (type: 'adicionar' | 'remover', local: 'ti' | 'servidor') => {
    setActionType(type);
    setLocal(local);
    setQuantity(1);  // Resetar a quantidade para 1 ao abrir o modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionType(null);
    setLocal(null);
  };

  const confirmAction = () => {
    if (actionType && local && quantity > 0) {
      if (actionType === 'adicionar') {
        handleAdicionar(local, quantity);  // Passa a quantidade
      } else if (actionType === 'remover') {
        handleRemover(local, quantity);  // Passa a quantidade
      }
    }
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : 0;
    if (value >= 0) {
      setQuantity(value);
    }
  };

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
        {/* Botão Histórico */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/historico')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <History size={18} />
            Ver Histórico de Entregas
          </button>
        </div>

        {/* Estoque Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EstoqueCard
            titulo="Sala de TI"
            quantidade={inventory.ti}
            onAdicionar={() => openModal('adicionar', 'ti')}
            onRemover={() => openModal('remover', 'ti')}
          />
          <EstoqueCard
            titulo="Servidor"
            quantidade={inventory.servidor}
            onAdicionar={() => openModal('adicionar', 'servidor')}
            onRemover={() => openModal('remover', 'servidor')}
          />
        </div>

        {/* Total de Notebooks */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total de Notebooks Disponíveis</h2>
          <p className="text-4xl font-bold text-blue-600">{totalNotebooks}</p>
        </div>

        {/* Formulário de Entrega */}
        <div className="max-w-md mx-auto">
          <EntregaForm
            onSubmit={handleEntrega}
            maxQuantidade={{ ti: inventory.ti, servidor: inventory.servidor }}
          />
        </div>

        {/* Modal de Confirmação */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
              <h3 className="text-xl font-semibold mb-4">
                Tem certeza que deseja {actionType === 'adicionar' ? 'adicionar' : 'remover'} {quantity} notebook{quantity > 1 ? 's' : ''} da {local === 'ti' ? 'Sala de TI' : 'Servidor'}?
              </h3>
              <div className="mb-4">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}  // Atualiza a quantidade digitada
                  className="px-4 py-2 w-full text-center border border-gray-300 rounded-md"
                  min="1"
                  max={inventory[local!]}  // Limita o valor máximo para a quantidade disponível
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
