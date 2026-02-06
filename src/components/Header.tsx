import { Plus } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  completedCount: number;
  totalCount: number;
}

export default function Header({ onAddClick, completedCount, totalCount }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-lg">
            <img 
              src="http://localhost:5000/api/projects/ddbc8fa5-1f82-4a42-b764-7eaf7634ff96/assets/45416fd4-7fe4-46da-86ab-631221cac3cc"
              alt="Todo App Forever Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Todo App Forever</h1>
            <p className="text-white/80">Управляйте своими задачами эффективно</p>
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Добавить задачу
        </button>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {completedCount} из {totalCount} завершено
            </h2>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-white/60 text-sm">Прогресс</div>
          </div>
        </div>
      </div>
    </header>
  );
}