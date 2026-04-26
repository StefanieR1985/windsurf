import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LongTermRentals from "@/components/LongTermRentals";
import Locations from "@/components/Locations";
import Features from "@/components/Features";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LongTermRentals />
        <Locations />
        <Features />
        <BlogSection />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
