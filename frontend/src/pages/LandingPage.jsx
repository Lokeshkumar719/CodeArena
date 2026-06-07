import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import TechStack from '../components/landing/TechStack';
import WhyCodeArena from '../components/landing/WhyCodeArena';
import Stats from '../components/landing/Stats';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <Hero />
      <Features />
      <TechStack />
      <WhyCodeArena />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
