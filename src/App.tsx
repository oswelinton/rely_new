import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <Features />
      <Gallery />
      <Contact />
    </div>
  );
}

export default App;
