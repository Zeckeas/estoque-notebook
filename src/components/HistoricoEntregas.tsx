import React from 'react';
import { NotebookDelivery } from '../types/inventory';

interface HistoricoEntregasProps {
  entregas: NotebookDelivery[];
}

export function HistoricoEntregas({ entregas }: HistoricoEntregasProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Histórico de Entregas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colaborador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Local
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entregas.map((entrega) => (
              <tr key={entrega.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(entrega.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{entrega.colaborador}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrega.local}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrega.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}