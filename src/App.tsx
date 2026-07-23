import CraonExactHero from './components/CraonExactHero';
import HeroDemo from './components/HeroDemo';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-[#080808] text-white selection:bg-[#ff683d] selection:text-[#180a05]">
      <SmoothScroll />
      <CraonExactHero />
      <HeroDemo />
      <Footer />
    </div>
  );
}
