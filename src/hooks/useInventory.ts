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
        .select('id, colaborador, quantidade, created_at, local_id, locais(nome)')
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
            local_id: e.local_id,
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

  async function handleAdicionar(local: 'ti' | 'servidor') {
    const localId = local === 'ti' ? 1 : 2;
    
    const { error } = await supabase
      .from('notebooks')
      .update({ quantidade: inventory[local] + 1 })
      .eq('local_id', localId);

    if (error) {
      console.error('Error adding notebook:', error);
    }

    // Recarregar o inventário após a mudança
    loadInventory();
  }

  async function handleRemover(local: 'ti' | 'servidor') {
    if (inventory[local] <= 0) return;
    
    const localId = local === 'ti' ? 1 : 2;
    
    const { error } = await supabase
      .from('notebooks')
      .update({ quantidade: inventory[local] - 1 })
      .eq('local_id', localId);

    if (error) {
      console.error('Error removing notebook:', error);
    }

    // Recarregar o inventário após a mudança
    loadInventory();
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

      // Recarregar o inventário após a entrega
      loadInventory();
    }
  }

  async function handleRemoverEntrega(id: string) {
    const entrega = inventory.historico.find(e => e.id === id);
    if (!entrega) return;

    const { error: deleteError } = await supabase
      .from('entregas')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error removing delivery:', deleteError);
      return;
    }

    // Get the current quantity for the location
    const { data: currentQuantity } = await supabase
      .from('notebooks')
      .select('quantidade')
      .eq('local_id', entrega.local_id)
      .single();

    if (!currentQuantity) {
      console.error('Error getting current quantity');
      return;
    }

    // Update the quantity by adding back the delivered amount
    const { error: updateError } = await supabase
      .from('notebooks')
      .update({ quantidade: currentQuantity.quantidade + entrega.quantidade })
      .eq('local_id', entrega.local_id);

    if (updateError) {
      console.error('Error updating notebook quantity:', updateError);
    }

    // Recarregar o inventário após a remoção
    loadInventory();
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
