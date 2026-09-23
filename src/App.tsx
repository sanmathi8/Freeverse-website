import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Freeverse3DScene from './components/3d/Freeverse3DScene';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Universe from './sections/Universe';
import About from './sections/About';
import Journey from './sections/Journey';
import Events from './sections/Events';
import Projects from './sections/Projects';
import Freelancers from './sections/Freelancers';
import FreeverseWall from './sections/FreeverseWall';
import OpportunityGateway from './sections/OpportunityGateway';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const { theme } = useTheme();
  const [trigger3DAnim, setTrigger3DAnim] = useState(false);

  const handleEnterFreeverse = () => {
    setTrigger3DAnim(true);
    setTimeout(() => {
      setTrigger3DAnim(false);
    }, 2500);
  };

  return (
    <AuthProvider>
      <div className="relative min-h-screen font-sans selection:bg-sky-500/30 selection:text-sky-900 dark:selection:text-white">
        {/* 3D WebGL Background Canvas */}
        <Freeverse3DScene theme={theme} triggerAnimation={trigger3DAnim} />

        {/* Navigation Header */}
        <Navbar />

        {/* Main Page Content with Atmospheric Section Gradients */}
        <main className="relative z-10">
          <div className="section-aurora-hero">
            <Hero onEnterFreeverse={handleEnterFreeverse} />
          </div>
          <div className="section-aurora-universe">
            <Universe />
          </div>
          <div className="section-aurora-about">
            <About />
          </div>
          <div>
            <Journey />
          </div>
          <div className="section-aurora-events">
            <Events />
          </div>
          <div className="section-aurora-projects">
            <Projects />
          </div>
          <div className="section-aurora-freelancers">
            <Freelancers />
          </div>
          <div>
            <FreeverseWall />
          </div>
          <div className="section-aurora-gateway">
            <OpportunityGateway />
          </div>
        </main>

        {/* Auth Modal Overlay */}
        <AuthModal />

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
