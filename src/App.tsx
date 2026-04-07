import { useState } from 'react';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Login from './components/Login';
import SalesModule from './components/SalesModule';
import OrdersInbox from './components/OrdersInbox';
import VehicleTracking from './components/VehicleTracking';
import { createClient } from '@supabase/supabase-js';

export type ViewType = 'home' | 'sales' | 'orders' | 'tracking';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
      } else {
        setIsAuthenticated(false);
        setUserEmail('');
        setCurrentView('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentView('home');
  };

  const handleViewChange = (view: ViewType) => {
    // Protect authenticated routes
    if (['sales', 'orders', 'tracking'].includes(view) && !isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }
    setCurrentView(view);
  };
  const renderView = () => {
    switch (currentView) {
      case 'sales':
        return isAuthenticated ? <SalesModule /> : null;
      case 'orders':
        return isAuthenticated ? <OrdersInbox /> : null;
      case 'tracking':
        return isAuthenticated ? <VehicleTracking /> : null;
      default:
        return (
          <>
            <Hero />
            <Features />
            <Gallery />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userEmail={userEmail}
      />
      {renderView()}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
