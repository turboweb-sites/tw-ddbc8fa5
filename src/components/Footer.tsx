export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Todo App Forever
            </h3>
            <p className="text-gray-400">
              Управляйте задачами эффективно и стильно
            </p>
          </div>
          
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
              <img 
                src="https://i.imgur.com/69Ylg2x.png" 
                alt="QR Code" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm mt-3">Сканируйте для быстрого доступа</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-purple-300">Быстрые ссылки</h4>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-gray-400 hover:text-purple-300 transition-colors"
              >
                О приложении
              </a>
              <a 
                href="#" 
                className="block text-gray-400 hover:text-purple-300 transition-colors"
              >
                Помощь
              </a>
              <a 
                href="#" 
                className="block text-gray-400 hover:text-purple-300 transition-colors"
              >
                Контакты
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Todo App Forever. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}