export interface ITodoItem  {
  text: string;
  completed: boolean;
  id: string | null;
  items: ITodoItem[];
}

