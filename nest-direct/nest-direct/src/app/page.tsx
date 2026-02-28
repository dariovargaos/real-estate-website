//components
import FeaturedProperties from "@/components/FeaturedProperties";
import Hero from "@/components/Hero";

import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <Hero />
      <FeaturedProperties />
    </Box>
  );
}
