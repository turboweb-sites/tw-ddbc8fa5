import { useState } from 'react';
import { Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Todo, UpdateTodoData } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, updates: UpdateTodoData) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'due_date'>('created');

  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      switch (filter) {
        case 'active':
          return !todo.completed && matchesSearch;
        case 'completed':
          return todo.completed && matchesSearch;
        case 'overdue':
          return !todo.completed && todo.due_date && new Date(todo.due_date) < new Date() && matchesSearch;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'due_date':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const overdueCount = todos.filter(todo => 
    !todo.completed && todo.due_date && new Date(todo.due_date) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="glass-effect rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200/20 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed' | 'overdue')}
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200/20 outline-none transition-all appearance-none"
            >
              <option value="all">Все задачи</option>
              <option value="active">Активные</option>
              <option value="completed">Завершенные</option>
              <option value="overdue">Просроченные</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created' | 'priority' | 'due_date')}
            className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200/20 outline-none transition-all appearance-none"
          >
            <option value="created">По дате создания</option>
            <option value="priority">По приоритету</option>
            <option value="due_date">По сроку выполнения</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 text-white/80">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm">Завершено: {completedCount}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm">Активных: {activeCount}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm">Просрочено: {overdueCount}</span>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass-effect rounded-xl p-8">
              <div className="text-white/60 mb-2">
                {searchTerm || filter !== 'all' ? '🔍' : '📝'}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm || filter !== 'all' ? 'Задачи не найдены' : 'Нет задач'}
              </h3>
              <p className="text-white/60">
                {searchTerm || filter !== 'all'
                  ? 'Попробуйте изменить критерии поиска или фильтры'
                  : 'Создайте свою первую задачу, нажав кнопку "Добавить задачу"'
                }
              </p>
            </div>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredTodos.length > 0 && (
        <div className="text-center text-white/60 text-sm">
          Показано {filteredTodos.length} из {todos.length} задач
        </div>
      )}
    </div>
  );
}