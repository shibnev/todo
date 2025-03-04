import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { ITask } from '../types';
import store from '../stores/task-store';

const TaskItem: React.FC<{ task: ITask; parentTask?: ITask }> = observer(({ task, parentTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleBlur = () => {
    store.updateTaskText(task, text);
    setIsEditing(false);
  };

  return (
    <div className="pl-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => store.toggleTask(task)}
        />
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="border px-2 py-1 rounded"
          />
        ) : (
          <span onClick={() => setIsEditing(true)}>{task.text}</span>
        )}
        <button onClick={() => store.addSubtask(task)} className="ml-2 text-blue-500">+</button>
        <button onClick={() => store.addTask(task)} className="ml-2 text-green-500">➕</button>
        <button onClick={() => store.deleteTask(task, parentTask)} className="ml-2 text-red-500">🗑</button>
      </div>
      <div className="ml-4">
        {task.subtasks.map(subtask => (
          <TaskItem key={subtask.id} task={subtask} parentTask={task} />
        ))}
      </div>
    </div>
  );
});

const TaskTree = observer(() => (
  <div className="p-4">
    {store.tasks.map(task => (
      <TaskItem key={task.id} task={task} />
    ))}
    <button onClick={() => store.addTask()} className="mt-4 p-2 bg-green-500 text-white rounded">Добавить задачу</button>
  </div>
));

const App = () => {
  useEffect(() => {
    store.loadTasks();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded-lg w-96">
        <h1 className="text-xl font-bold mb-4">Список задач</h1>
        <TaskTree />
      </div>
    </div>
  );
};

export default App;
