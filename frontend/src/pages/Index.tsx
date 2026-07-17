import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Rooms } from "@/components/site/Rooms";
import { Gallery } from "@/components/site/Gallery";
import { Reviews } from "@/components/site/Reviews";
import { BookingForm } from "@/components/site/BookingForm";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Index() {
  useEffect(() => {
    document.title = "Valley Medows — Guest House & Homestay in Srinagar, Kashmir";
  }, []);
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: "Valley Medows",
            address: {
              "@type": "PostalAddress",
              streetAddress: "IGI Airport Road, Alochi Bagh Rd, Elachi Bagh",
              addressLocality: "Srinagar",
              addressRegion: "Jammu and Kashmir",
              postalCode: "190008",
              addressCountry: "IN",
            },
            telephone: "+919419202363",
            email: "valleymedowskmr@gmail.com",
          }),
        }}
      />
      <Navbar />
      <Hero />
      <Rooms />
      <Gallery />
      <Reviews />
      <BookingForm />
      <Contact />
      <Footer />
    </main>
  );
}