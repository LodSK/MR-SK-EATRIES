import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedMeals } from "@/components/home/FeaturedMeals";
import { Categories } from "@/components/home/Categories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Stats } from "@/components/home/Stats";

export const metadata: Metadata = {
  title: "Home",
  description:
    "MR_SK EATRIES — a premium modern restaurant serving elevated comfort food, crafted cocktails, and reservations for every occasion. Taste Beyond Expectations.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedMeals />
      <Categories />
      <WhyChooseUs />
      <Stats />
    </>
  );
}
