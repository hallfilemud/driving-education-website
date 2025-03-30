import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import StateSelector from "@/components/home/StateSelector";
import FeaturedResources from "@/components/home/FeaturedResources";
import PracticeTests from "@/components/home/PracticeTests";
import SampleQuestions from "@/components/home/SampleQuestions";
import DrivingTips from "@/components/home/DrivingTips";
import Newsletter from "@/components/layout/Newsletter";
import AdPlaceholder from "@/components/shared/AdPlaceholder";

export default function Home() {
  return (
    <div>
      <Hero />
      <SearchBar />
      <StateSelector />
      <FeaturedResources />
      <AdPlaceholder />
      <PracticeTests />
      <SampleQuestions />
      <DrivingTips />
      <Newsletter />
    </div>
  );
}
