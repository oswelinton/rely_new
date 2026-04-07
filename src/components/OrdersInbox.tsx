import { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, Calendar, DollarSign, User, Phone, Mail, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Order {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reference_number: string;
  price: number;
  created_at: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Detalles de la Orden</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="text-gray-400 text-xl">×</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Número de Referencia
                </label>
                <div className="bg-orange-600/20 p-3 rounded-lg">
                  <p className="text-xl font-bold text-orange-500">
                    {order.reference_number}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Cliente
                </label>
                <p className="text-white text-lg">
                  {order.first_name} {order.last_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-gray-300">{order.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-300">{order.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Precio
                </label>
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">
                    ${order.price.toLocaleString()} USD
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Fecha de Orden
                </label>
                <p className="text-gray-300">
                  {new Date(order.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Estado
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-600/20 text-yellow-500">
                  Pendiente
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Procesar Orden
            </button>
            <button className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors">
              Contactar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersInbox() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Error al cargar las órdenes');
        return;
      }

      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.reference_number.includes(searchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bandeja de Órdenes
            </h1>
            <p className="text-xl text-gray-400">
              Gestiona todas las compras de vehículos
            </p>
          </div>
          
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <RefreshCw size={20} />
            Actualizar
          </button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o número de referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                <Filter size={20} />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <Package className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Órdenes</p>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/20 p-3 rounded-lg">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ventas Totales</p>
                <p className="text-2xl font-bold text-white">
                  ${orders.reduce((sum, order) => sum + order.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <Calendar className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hoy</p>
                <p className="text-2xl font-bold text-white">
                  {orders.filter(order => 
                    new Date(order.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <User className="text-purple-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Promedio</p>
                <p className="text-2xl font-bold text-white">
                  ${orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + order.price, 0) / orders.length).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Órdenes */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">
              Órdenes Recientes ({filteredOrders.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando órdenes...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchOrders}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No se encontraron órdenes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Referencia</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Cliente</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Contacto</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Precio</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Fecha</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-900/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-orange-500 font-medium">
                          {order.reference_number}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">
                            {order.first_name} {order.last_name}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Mail size={14} />
                            {order.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Phone size={14} />
                            {order.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-green-500 font-bold text-lg">
                          ${order.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString('es-ES')}
                          <br />
                          {new Date(order.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}