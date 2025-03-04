export interface ITask {
  id: number;
  text: string;
  completed: boolean;
  subtasks: ITask[];
}
