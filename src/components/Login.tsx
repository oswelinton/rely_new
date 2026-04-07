import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Login({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setIsLoading(false);
        return;
      }

      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (result.error) {
        if (result.error.message.includes('Invalid login credentials')) {
          setError('Credenciales incorrectas');
        } else if (result.error.message.includes('User already registered')) {
          setError('Este email ya está registrado. Intenta iniciar sesión.');
        } else {
          setError(result.error.message);
        }
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        setError('');
        setIsSignUp(false);
        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      } else {
        onLoginSuccess(email);
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="admin@rely.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                  </>
                ) : (
                  isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
                )}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-orange-500 hover:text-orange-400 transition-colors text-sm"
                >
                  {isSignUp 
                    ? '¿Ya tienes cuenta? Inicia sesión' 
                    : '¿No tienes cuenta? Crear una nueva'
                  }
                </button>
              </div>
            </div>
          </form>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Credenciales de prueba:</p>
              <p className="text-gray-300 text-sm">Email: admin@rely.com</p>
              <p className="text-gray-300 text-sm">Contraseña: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}