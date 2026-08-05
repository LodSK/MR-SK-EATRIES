import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { MeetOurChefs } from "@/components/about/MeetOurChefs";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { AwardsRecognition } from "@/components/about/AwardsRecognition";
import { WhyCustomersLoveUs } from "@/components/about/WhyCustomersLoveUs";
import { AboutCTA } from "@/components/about/AboutCTA";
import { ABOUT_HERO_IMAGE } from "@/lib/constants/media";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story behind MR_SK EATRIES — our history, our kitchen team, the milestones that shaped us, and why guests keep coming back.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero imageSrc={ABOUT_HERO_IMAGE} />
      <OurStory />
      <MeetOurChefs />
      <JourneyTimeline />
      <AwardsRecognition />
      <WhyCustomersLoveUs />
      <AboutCTA />
    </>
  );
}
