//components
import CTASection from "../../components/CTASection";
import FeaturedProperties from "../../components/FeaturedProperties";
import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import { Toaster } from "../../components/ui/toaster";

import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <CTASection />
      <Toaster />
    </Box>
  );
}
