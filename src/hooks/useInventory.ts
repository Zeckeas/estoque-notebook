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
  
    // Cleanup para evitar múltiplas assinaturas
    return () => {
      supabase.removeChannel(notebooksSubscription);
      supabase.removeChannel(entregasSubscription);
    };
  }

  async function handleAdicionar(local: 'ti' | 'servidor') {
    const localId = local === 'ti' ? 1 : 2;
    const newQuantity = inventory[local] + 1;
  
    // Atualiza o estado imediatamente
    setInventory((prev) => ({
      ...prev,
      [local]: newQuantity,
    }));
  
    // Faz a atualização no banco
    const { error } = await supabase
      .from('notebooks')
      .update({ quantidade: newQuantity })
      .eq('local_id', localId);
  
    if (error) {
      console.error('Error adding notebook:', error);
      // Recarrega o inventário se ocorrer erro
      await loadInventory();
    }
  }

  async function handleRemover(local: 'ti' | 'servidor') {
    if (inventory[local] <= 0) return;
  
    const localId = local === 'ti' ? 1 : 2;
    const newQuantity = inventory[local] - 1;
  
    // Atualiza o estado imediatamente
    setInventory((prev) => ({
      ...prev,
      [local]: newQuantity,
    }));
  
    // Faz a atualização no banco
    const { error } = await supabase
      .from('notebooks')
      .update({ quantidade: newQuantity })
      .eq('local_id', localId);
  
    if (error) {
      console.error('Error removing notebook:', error);
      // Recarrega o inventário se ocorrer erro
      await loadInventory();
    }
  }

  async function handleEntrega(data: { colaborador: string; quantidade: number; local: 'TI' | 'Servidor' }) {
    const localId = data.local === 'TI' ? 1 : 2;
    const localKey = data.local === 'TI' ? 'ti' : 'servidor';

    if (inventory[localKey] >= data.quantidade) {
      const { error: entregaError } = await supabase
        .from('entregas')
        .insert({
          colaborador: data.colaborador,
          quantidade: data.quantidade,
          local_id: localId,
        });

      if (entregaError) {
        console.error('Error registering delivery:', entregaError);
        return;
      }

      const { error: notebookError } = await supabase
        .from('notebooks')
        .update({ quantidade: inventory[localKey] - data.quantidade })
        .eq('local_id', localId);

      if (notebookError) {
        console.error('Error updating notebook quantity:', notebookError);
      }
    }
  }

  return {
    inventory,
    loading,
    handleAdicionar,
    handleRemover,
    handleEntrega,
  };
}