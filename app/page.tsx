import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Newsletter from "./components/sections/Newsletter";
import BlogCards from "./components/sections/BlogCards";
import About from "./components/sections/About";
import Servicios from "./components/sections/Servicios";
import Recursos from "./components/sections/Recursos";
import PreguntaleExperta from "./components/sections/PreguntaleExperta";
import Footer from "./components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Newsletter />
      <BlogCards />
      <About />
      <Servicios />
      <Recursos />
      <PreguntaleExperta />
      <Footer />
    </main>
  );
}
