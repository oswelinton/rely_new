import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img
              src="/photo_2026-03-24_07-09-28_(3).jpg"
              alt="RELY"
              className="h-8 w-auto brightness-0 invert"
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-300 hover:text-white transition-colors">
              Inicio
            </a>
            <a href="#vehiculos" className="text-gray-300 hover:text-white transition-colors">
              Vehículos
            </a>
            <a href="#caracteristicas" className="text-gray-300 hover:text-white transition-colors">
              Características
            </a>
            <a href="#contacto" className="text-gray-300 hover:text-white transition-colors">
              Contacto
            </a>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
              Agendar Prueba
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <a href="#inicio" className="block text-gray-300 hover:text-white py-2">
              Inicio
            </a>
            <a href="#vehiculos" className="block text-gray-300 hover:text-white py-2">
              Vehículos
            </a>
            <a href="#caracteristicas" className="block text-gray-300 hover:text-white py-2">
              Características
            </a>
            <a href="#contacto" className="block text-gray-300 hover:text-white py-2">
              Contacto
            </a>
            <button className="w-full bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors mt-2">
              Agendar Prueba
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
