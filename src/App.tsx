import { useState, useEffect } from 'react';
import { db } from './lib/supabase';
import { Todo, CreateTodoData, UpdateTodoData } from './types/todo';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import Footer from './components/Footer';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setError(null);
      const data = await db.getAll('todos');
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
      setError('Ошибка загрузки задач');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData: CreateTodoData) => {
    try {
      setError(null);
      const newTodo = await db.create('todos', todoData);
      setTodos([newTodo, ...todos]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Ошибка создания задачи');
    }
  };

  const handleUpdateTodo = async (id: string, updates: UpdateTodoData) => {
    try {
      setError(null);
      const updatedTodo = await db.update('todos', id, updates);
      if (updatedTodo) {
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Ошибка обновления задачи');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    try {
      setError(null);
      await db.delete('todos', id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Ошибка удаления задачи');
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Мои задачи</h2>
              <p className="text-gray-600 mt-1">
                Выполнено {completedCount} из {totalCount}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {showAddForm ? 'Отмена' : '+ Новая задача'}
            </button>
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="mb-6">
            <AddTodoForm onSubmit={handleAddTodo} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}