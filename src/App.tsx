import { useState, useEffect } from 'react';
import { db } from './lib/supabase';
import { Todo, CreateTodoData, UpdateTodoData } from './types/todo';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
          <p className="text-white text-center">Загрузка задач...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Header
          onAddClick={() => setShowAddForm(true)}
          completedCount={completedCount}
          totalCount={todos.length}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        <TodoList
          todos={todos}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />

        {showAddForm && (
          <AddTodoForm
            onAdd={handleAddTodo}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}