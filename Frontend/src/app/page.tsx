import About from "@/components/About";
import Blog from "@/components/Blog";
// import Brands from "@/components/Brands";
// import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Feature from "@/components/Features";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Hero from "@/components/Hero";
import Integration from "@/components/Integration";
// import Pricing from "@/components/Pricing";
// import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <Brands /> */}
      <Feature />
      <About />
      <FeaturesTab />
      <FunFact />
      <Integration />
      <CTA />
      <FAQ />
      {/* <Testimonial /> */}
      {/* <Pricing /> */}
      {/* <Contact /> */}
      <Blog />
    </main>
  );
}
