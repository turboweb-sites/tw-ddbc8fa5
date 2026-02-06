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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header 
          onAddClick={() => setShowAddForm(true)}
          completedCount={completedCount}
          totalCount={todos.length}
        />

        {error && (
          <div className="glass-effect rounded-xl p-4 mb-4 border border-red-500/30 bg-red-500/10">
            <p className="text-white font-medium">{error}</p>
          </div>
        )}

        {showAddForm && (
          <AddTodoForm 
            onSubmit={handleAddTodo}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {loading ? (
          <div className="glass-effect rounded-xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
            <p className="text-white mt-4">Загрузка задач...</p>
          </div>
        ) : (
          <TodoList 
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        )}

        {!loading && todos.length === 0 && (
          <div className="glass-effect rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">Нет задач</h3>
            <p className="text-white/60 mb-6">Начните с добавления вашей первой задачи!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Добавить первую задачу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}