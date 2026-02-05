import { useState } from 'react';
import { Check, Trash2, Edit3, Calendar, Flag, Clock } from 'lucide-react';
import { Todo, UpdateTodoData } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: UpdateTodoData) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    due_date: todo.due_date || '',
  });

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleEdit = () => {
    if (isEditing) {
      onUpdate(todo.id, {
        title: editData.title,
        description: editData.description || undefined,
        priority: editData.priority,
        due_date: editData.due_date || undefined,
      });
    }
    setIsEditing(!isEditing);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;
  const isDueToday = todo.due_date && new Date(todo.due_date).toDateString() === new Date().toDateString();

  return (
    <div className={`todo-card p-6 transition-all duration-300 hover:shadow-xl ${
      todo.completed ? 'opacity-75' : ''
    } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-gradient-to-r from-green-400 to-blue-500 border-green-400'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {todo.completed && <Check className="h-4 w-4 text-white" />}
        </button>

        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                rows={2}
                placeholder="Описание..."
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
                <input
                  type="date"
                  value={editData.due_date}
                  onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className={`font-semibold text-gray-800 mb-2 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-gray-600 mb-3 ${
                  todo.completed ? 'line-through text-gray-400' : ''
                }`}>
                  {todo.description}
                </p>
              )}

              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                  <Flag className="h-3 w-3 inline mr-1" />
                  {getPriorityLabel(todo.priority)}
                </span>

                {todo.due_date && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    isOverdue
                      ? 'text-red-600 bg-red-100 border-red-200'
                      : isDueToday
                      ? 'text-orange-600 bg-orange-100 border-orange-200'
                      : 'text-blue-600 bg-blue-100 border-blue-200'
                  }`}>
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {isOverdue ? 'Просрочено' : isDueToday ? 'Сегодня' : new Date(todo.due_date).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Создано: {new Date(todo.created_at).toLocaleDateString('ru-RU')}
                </span>
                {todo.updated_at !== todo.created_at && (
                  <span>
                    Обновлено: {new Date(todo.updated_at).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className={`p-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title={isEditing ? 'Сохранить' : 'Редактировать'}
          >
            {isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
          
          {!isEditing && (
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}