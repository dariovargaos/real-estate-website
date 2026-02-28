//components
import FeaturedProperties from "@/components/FeaturedProperties";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
    </Box>
  );
}
