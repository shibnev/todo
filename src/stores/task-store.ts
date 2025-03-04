import { makeAutoObservable } from 'mobx';
import { ITask } from '../types';

class TaskStore {
  tasks: ITask[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadTasks();
  }

  saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  };

  loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  };

  toggleTask = (task: ITask) => {
    task.completed = !task.completed;
    task.subtasks.forEach(sub => this.toggleSubtasks(sub, task.completed));
    this.updateParentCompletion(task);
    this.saveTasks();
  };

  toggleSubtasks = (task: ITask, state: boolean) => {
    task.completed = state;
    task.subtasks.forEach(sub => this.toggleSubtasks(sub, state));
  };

  updateTaskText = (task: ITask, text: string) => {
    task.text = text;
    this.saveTasks();
  };

  addSubtask = (task: ITask) => {
    const newSubtask: ITask = { id: Date.now(), text: "new subtask", completed: false, subtasks: [] };
    task.subtasks.push(newSubtask);
    this.saveTasks();
  };

  addTask = (parentTask?: ITask) => {
    const newTask: ITask = { id: Date.now(), text: "new task", completed: false, subtasks: [] };
    if (parentTask) {
      parentTask.subtasks.push(newTask);
    } else {
      this.tasks.push(newTask);
    }
    this.saveTasks();
  };

  deleteTask = (task: ITask, parentTask?: ITask) => {
    if (parentTask) {
      parentTask.subtasks = parentTask.subtasks.filter(t => t.id !== task.id);
    } else {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }
    this.saveTasks();
  };

  updateParentCompletion = (task: ITask | undefined) => {
    if (!task) return;

    let parentTask = this.findParentTask(this.tasks, task);
    while (parentTask) {
      parentTask.completed = parentTask.subtasks.every((sub: ITask) => sub.completed);
      parentTask = this.findParentTask(this.tasks, parentTask);
    }
    this.saveTasks();
  };

  findParentTask = (tasks: ITask[], child: ITask): ITask | undefined => {
    for (const task of tasks) {
      if (task.subtasks.includes(child)) return task;
      const parent = this.findParentTask(task.subtasks, child);
      if (parent) return parent;
    }
    return undefined;
  };
}

const store = new TaskStore();
export default store;
