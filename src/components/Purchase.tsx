import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  referenceNumber: string;
}

interface SubmissionState {
  isSubmitted: boolean;
  referenceNumber: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Purchase({ isOpen, onClose }: PurchaseModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referenceNumber: '',
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitted: false,
    referenceNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.referenceNumber) {
        setError('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }

      if (!/^\d+$/.test(formData.referenceNumber)) {
        setError('El número de referencia debe contener solo dígitos');
        setIsLoading(false);
        return;
      }

      const { error: dbError } = await supabase
        .from('orders')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            reference_number: formData.referenceNumber,
            price: 50000,
          }
        ]);

      if (dbError) {
        if (dbError.message.includes('duplicate key')) {
          setError('Este número de referencia ya ha sido registrado');
        } else {
          setError('Error al registrar la compra. Intenta de nuevo.');
        }
        setIsLoading(false);
        return;
      }

      setSubmissionState({
        isSubmitted: true,
        referenceNumber: formData.referenceNumber,
      });

      setTimeout(() => {
        onClose();
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          referenceNumber: '',
        });
        setSubmissionState({
          isSubmitted: false,
          referenceNumber: '',
        });
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Comprar RELY</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={24} />
          </button>
        </div>

        <div className="p-6">
          {submissionState.isSubmitted ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500/20 p-4 rounded-full">
                  <Check className="text-green-500" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Compra registrada!</h3>
              <p className="text-gray-400 mb-4">
                Tu número de referencia es:
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-2xl font-bold text-orange-500">
                  {submissionState.referenceNumber}
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Nos pondremos en contacto pronto para confirmar los detalles
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-6">
                <p className="text-gray-400 text-sm mb-1">Precio del vehículo</p>
                <p className="text-3xl font-bold text-orange-500">$50.000 USD</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombres
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Nombres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Apellidos"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electronico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="correo@electronico.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="+58 (0000) 000-00-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Referencia de Pago
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Ej: 123456789"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Procesando...' : 'Confirmar Compra'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-900 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors border border-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
