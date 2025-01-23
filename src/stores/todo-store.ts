import { makeAutoObservable } from 'mobx';
import { ITodoItem } from '../types';

class TodoStore {
  todos: ITodoItem[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadTodos();
  }

  addTodo = () => {
    this.todos.push({
      text: '',
      completed: false,
      id: crypto.randomUUID(),
      items: []
    });

    this.saveTodos();
  }

  toggleTodoCompletion = (id: string) => {
    const toggleCompletion = (todos: ITodoItem[]) => {
      for (const todo of todos) {
        if (todo.id === id) {
          todo.completed = !todo.completed;
          return;
        }
        if (todo.items) {
          toggleCompletion(todo.items);
        }
      }
    };
    toggleCompletion(this.todos);
    this.saveTodos();
  }

  removeTodo = (id: string, parentId: string | null = null) => {
    if (parentId === null) {
      this.todos = this.todos.filter(todo => todo.id !== id);
    } else {
      const parentTodo = this.todos.find(todo => todo.id === parentId);

      if (parentTodo && parentTodo.items) {
        parentTodo.items = parentTodo.items.filter(item => item.id !== id);
      }
    }
    this.saveTodos();
  }

  addSubTask = (id: string, parentId: string | null = null) => {
    if (parentId === null) {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        todo.items.push({
          text: '',
          completed: false,
          id: crypto.randomUUID(),
          items: []
        });
      }
    } else {
      const parentTodo = this.todos.find(todo => todo.id === parentId);

      if (parentTodo) {
        const subTask = parentTodo.items.find(item => item.id === id);
        if (subTask) {
          subTask.items.push({
            text: '',
            completed: false,
            id: crypto.randomUUID(),
            items: []
          });
        }
      }
    }
    this.saveTodos();
  }

  updateTodoText = (id: string, text: string) => {
    const updateText = (todos: ITodoItem[]) => {
      for (const todo of todos) {
        if (todo.id === id) {
          todo.text = text;
          return;
        }
        if (todo.items) {
          updateText(todo.items);
        }
      }
    };
    updateText(this.todos);
    this.saveTodos();
  }

  saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadTodos = () => {
    const savedTodos = localStorage.getItem('todos');

    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  }
}

const todoStore = new TodoStore();
export default todoStore;
