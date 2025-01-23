import DataTitle from './DataTitle';
import Todo from './Todo';

const App = () => {
  return (
    <div className="container mx-auto py-4 px-4 h-screen flex flex-col max-w-screen-sm">
      <DataTitle />
      <Todo />
    </div>
  )
};

export default App
