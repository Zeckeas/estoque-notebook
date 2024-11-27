export interface NotebookDelivery {
  id: string;
  colaborador: string;
  quantidade: number;
  local: 'TI' | 'Servidor';
  local_id: number;
  data: string;
}

export interface InventoryState {
  ti: number;
  servidor: number;
  historico: NotebookDelivery[];
}