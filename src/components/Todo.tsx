import IconPlus from '../assets/plus.svg?react';
import IconSubTask from '../assets/subtask.svg?react';
import { observer } from 'mobx-react-lite';
import todoStore from '../stores/todo-store';
import { useEffect, useRef, useState } from 'react';
import Checkbox from './Checkbox';
import { ITodoItem } from '../types';

const Todo = observer(() => {
  const { todos, toggleTodoCompletion, addTodo, removeTodo, updateTodoText, addSubTask } = todoStore;
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [newTodoAdded, setNewTodoAdded] = useState(false);

  useEffect(() => {
    if (newTodoAdded && Object.keys(inputRefs.current).length > 0) {
      const lastKey = Object.keys(inputRefs.current)[Object.keys(inputRefs.current).length - 1];

      inputRefs.current[lastKey]?.focus();
      setNewTodoAdded(false);
    }
  }, [todos.length, newTodoAdded]);

  function handleAddTodo() {
    addTodo();
    setNewTodoAdded(true);
  };

  function removeTodoIfEmpty(id: string, parentId: string | null = null) {
    if (parentId === null) {
      const todo = todos.find(todo => todo.id === id);

      if (todo && todo.text.trim() === '') {
        removeTodo(id);
      }
    } else {
      const parentTodo = todos.find(todo => todo.id === parentId);

      if (parentTodo && parentTodo.items) {
        const subTask = parentTodo.items.find(item => item.id === id);

        if (subTask && subTask.text.trim() === '') {
          removeTodo(id, parentId);
        }
      }
    }
  }

  function handleOnBlur(id: string, parentId: string | null = null) {
    removeTodoIfEmpty(id, parentId);
  }

  function renderTodoItem(todo: ITodoItem, parentId: string | null = null) {
    return (
      <div key={todo.id} className="border-b">
        <div className='flex items-center gap-2 py-2'>
          <Checkbox
            checked={todo.completed}
            onChange={() => todo.id && toggleTodoCompletion(todo.id)}
          />

          <input
            type="text"
            value={todo.text}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            className="h-10 w-full outline-none"
            onChange={(e) => todo.id && updateTodoText(todo.id, e.target.value)}
            ref={(el) => todo.id && (inputRefs.current[todo.id] = el)}
            onBlur={() => todo.id && handleOnBlur(todo.id, parentId)}
          />

          <button
            onClick={() => todo.id && addSubTask(todo.id, parentId)}
            className='bg-stone-800 flex justify-center items-center h-10 w-10 aspect-square'>
            <IconSubTask className='h-6' />
          </button>

          <button
            onClick={() => todo.id && removeTodo(todo.id, parentId)}
            className="text-white bg-red-500 ml-auto px-2 py-1 h-10"
          >
            Delete
          </button>
        </div>

        {todo.items && todo.items.map((subTask) => (
          <div key={subTask.id} className="ml-4">
            {renderTodoItem(subTask, todo.id)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="p-4">
        <div className="flex flex-col gap-2">
          {todos.map((todo) => renderTodoItem(todo))}
        </div>
      </div>

      <button
        onClick={handleAddTodo}
        className='rounded-xl w-20 h-20 absolute bottom-10 right-10 bg-stone-800 flex justify-center items-center'
      >
        <span className='text-white text-4xl'>
          <IconPlus />
        </span>
      </button>
    </div>
  )
});

export default Todo;
