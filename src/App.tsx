import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { EstoqueCard } from './components/EstoqueCard';
import { EntregaForm } from './components/EntregaForm';
import { HistoricoEntregas } from './components/HistoricoEntregas';
import { useInventory } from './hooks/useInventory';

function InventoryDashboard() {
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <InventoryDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;