export interface NotebookDelivery {
  id: string;
  colaborador: string;
  quantidade: number;
  local: 'TI' | 'Servidor';
  data: string;
}

export interface InventoryState {
  ti: number;
  servidor: number;
  historico: NotebookDelivery[];
}