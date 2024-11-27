import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { useInventory } from '../hooks/useInventory';

export function HistoricoPage() {
  const navigate = useNavigate();
  const { inventory, loading, handleRemoverEntrega } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);  // Controle do Modal
  const [entregaId, setEntregaId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setEntregaId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEntregaId(null);
  };

  const confirmAction = () => {
    if (entregaId) {
      handleRemoverEntrega(entregaId);
    }
    closeModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 flex items-center justify-center">
        <p className="text-2xl font-semibold text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-gray-50 to-blue-100">
      <Header />
      <div className="max-w-6xl mx-auto p-8 space-y-10">
        {/* Botão de Voltar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-300 ease-in-out"
          >
            <ArrowLeft size={20} />
            <span className="text-lg font-semibold">Voltar ao Dashboard</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Histórico de Entregas</h2>
        </div>

        {/* Tabela de Histórico */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Colaborador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.historico.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-blue-50 transition-all duration-300 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entrega.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entrega.colaborador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entrega.local}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entrega.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(entrega.id)}
                        className="text-red-600 hover:text-red-900 transition-all duration-300 ease-in-out"
                        title="Remover entrega"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Confirmação */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
              <h3 className="text-xl font-semibold mb-4">
                Tem certeza que deseja remover esta entrega?
              </h3>
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
