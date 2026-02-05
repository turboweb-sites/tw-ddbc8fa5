import { useState } from 'react';
import { X, Calendar, Flag, FileText } from 'lucide-react';
import { CreateTodoData } from '../types/todo';

interface AddTodoFormProps {
  onAdd: (todo: CreateTodoData) => void;
  onCancel: () => void;
}

export default function AddTodoForm({ onAdd, onCancel }: AddTodoFormProps) {
  const [formData, setFormData] = useState<CreateTodoData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAdd({
        ...formData,
        description: formData.description || undefined,
        due_date: formData.due_date || undefined,
      });
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="todo-card max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Новая задача</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название задачи
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Введите название задачи..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Описание (опционально)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Добавьте детали задачи..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="h-4 w-4 inline mr-1" />
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="input-field"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Срок выполнения
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Создать задачу
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>

        {formData.title && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Предпросмотр:</div>
            <div className="font-medium text-gray-800">{formData.title}</div>
            {formData.description && (
              <div className="text-sm text-gray-600 mt-1">{formData.description}</div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                {getPriorityLabel(formData.priority)}
              </span>
              {formData.due_date && (
                <span className="text-xs text-gray-500">
                  до {new Date(formData.due_date).toLocaleDateString('ru-RU')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}