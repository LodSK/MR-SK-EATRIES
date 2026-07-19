import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TodaysSpecials } from "@/components/home/TodaysSpecials";
import { FeaturedMeals } from "@/components/home/FeaturedMeals";
import { Categories } from "@/components/home/Categories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { FAQ } from "@/components/home/FAQ";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "Home",
  description:
    "MR_SK EATRIES — a premium modern restaurant serving elevated comfort food, crafted cocktails, and reservations for every occasion. Taste Beyond Expectations.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TodaysSpecials />
      <FeaturedMeals />
      <Categories />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <InstagramGallery />
      <FAQ />
      <Newsletter />
    </>
  );
}
