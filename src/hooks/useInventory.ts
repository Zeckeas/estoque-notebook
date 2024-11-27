import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { NotebookDelivery } from '../types/inventory';

export function useInventory() {
  const [inventory, setInventory] = useState({
    ti: 0,
    servidor: 0,
    historico: [] as NotebookDelivery[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
    subscribeToChanges();
  }, []);

  async function loadInventory() {
    try {
      const { data: notebooks } = await supabase
        .from('notebooks')
        .select('quantidade, locais(id, nome)')
        .order('local_id');

      const { data: entregas } = await supabase
        .from('entregas')
        .select('id, colaborador, quantidade, created_at, locais(nome)')
        .order('created_at', { ascending: false });

      if (notebooks && entregas) {
        setInventory({
          ti: notebooks[0]?.quantidade || 0,
          servidor: notebooks[1]?.quantidade || 0,
          historico: entregas.map(e => ({
            id: e.id.toString(),
            colaborador: e.colaborador,
            quantidade: e.quantidade,
            local: e.locais.nome as 'TI' | 'Servidor',
            data: e.created_at,
          })),
        });
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToChanges() {
    const notebooksSubscription = supabase
      .channel('notebooks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notebooks' }, loadInventory)
      .subscribe();

    const entregasSubscription = supabase
      .channel('entregas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entregas' }, loadInventory)
      .subscribe();

    return () => {
      notebooksSubscription.unsubscribe();
      entregasSubscription.unsubscribe();
    };
  }

 // Função para adicionar notebooks
async function handleAdicionar(local: 'ti' | 'servidor') {
  const localId = local === 'ti' ? 1 : 2;

  try {
    const { data: updatedData, error } = await supabase
      .from('notebooks')
      .update({ quantidade: inventory[local] + 1 })
      .eq('local_id', localId)
      .select();

    if (error) throw error;

    // Atualizar o estado local com a nova quantidade de notebooks
    setInventory((prev) => ({
      ...prev,
      [local]: updatedData[0]?.quantidade || prev[local],
    }));
  } catch (error) {
    console.error('Error adding notebook:', error);
  }
}

// Função para remover notebooks
async function handleRemover(local: 'ti' | 'servidor') {
  if (inventory[local] <= 0) return;

  const localId = local === 'ti' ? 1 : 2;

  try {
    const { data: updatedData, error } = await supabase
      .from('notebooks')
      .update({ quantidade: inventory[local] - 1 })
      .eq('local_id', localId)
      .select();

    if (error) throw error;

    // Atualizar o estado local com a nova quantidade de notebooks
    setInventory((prev) => ({
      ...prev,
      [local]: updatedData[0]?.quantidade || prev[local],
    }));
  } catch (error) {
    console.error('Error removing notebook:', error);
  }
}

async function handleEntrega(data: { colaborador: string; quantidade: number; local: 'TI' | 'Servidor' }) {
  const localId = data.local === 'TI' ? 1 : 2;
  const localKey = data.local === 'TI' ? 'ti' : 'servidor';

  if (inventory[localKey] >= data.quantidade) {
    try {
      // Inserir a entrega no banco de dados
      const { error: entregaError } = await supabase
        .from('entregas')
        .insert({
          colaborador: data.colaborador,
          quantidade: data.quantidade,
          local_id: localId,
        });

      if (entregaError) throw entregaError;

      // Atualiza a quantidade de notebooks no banco de dados
      const { data: updatedData, error: notebookError } = await supabase
        .from('notebooks')
        .update({ quantidade: inventory[localKey] - data.quantidade })
        .eq('local_id', localId)
        .select();

      if (notebookError) throw notebookError;

      // Atualiza o estado local com a nova quantidade de notebooks
      setInventory((prev) => ({
        ...prev,
        [localKey]: updatedData[0]?.quantidade || prev[localKey],
        historico: [
          ...prev.historico,
          {
            id: Date.now().toString(),
            colaborador: data.colaborador,
            quantidade: data.quantidade,
            local: data.local,
            data: new Date().toISOString(),
          },
        ], // Adiciona a nova entrega no histórico local
      }));
    } catch (error) {
      console.error('Error processing delivery:', error);
    }
  } else {
    console.log('Quantidade de notebooks insuficiente');
  }
}


  async function handleRemoverEntrega(id: string) {
    // Encontre a entrega no estado local
    const entrega = inventory.historico.find((e) => e.id === id);
    if (!entrega) return;
  
    // Defina os valores de localId e localKey com base na entrega
    const localId = entrega.local === 'TI' ? 1 : 2;
    const localKey = entrega.local === 'TI' ? 'ti' : 'servidor';
  
    // Remover a entrega do banco de dados
    const { error: deleteError } = await supabase
      .from('entregas')
      .delete()
      .eq('id', id);
  
    if (deleteError) {
      console.error('Erro ao remover entrega:', deleteError);
      return;
    }
  
    // Atualizar a quantidade de notebooks no banco de dados
    const { error: updateError } = await supabase
      .from('notebooks')
      .update({ quantidade: inventory[localKey] + entrega.quantidade })
      .eq('local_id', localId);
  
    if (updateError) {
      console.error('Erro ao atualizar quantidade de notebooks:', updateError);
      return;
    }
  
    // Atualize o estado local removendo a entrega
    setInventory((prev) => ({
      ...prev,
      historico: prev.historico.filter((entrega) => entrega.id !== id), // Remover a entrega do estado
      [localKey]: prev[localKey] + entrega.quantidade, // Atualizar a quantidade de notebooks localmente
    }));
  }
  

  return {
    inventory,
    loading,
    handleAdicionar,
    handleRemover,
    handleEntrega,
    handleRemoverEntrega,
  };
}