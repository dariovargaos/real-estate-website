import { Box, Flex, Text, Button } from "@chakra-ui/react";

export default function CTASection() {
  return (
    <Flex direction="column" bg="#1D212B" p={10} maxH="500px">
      <Flex direction="column" align="center" justify="center" gap={5}>
        <Text color="white" fontSize="5xl">
          Ready to Buy or Sell?
        </Text>
        <Box maxW="500px">
          <Text color="#B9B9BB" wordWrap="break-word" textAlign="center">
            {" "}
            Join thousands of homeowners who are saving money by dealing
            directly.
          </Text>
        </Box>

        <Flex gap={5} mt={5} mb={5}>
          <Button
            bg="#E99E35"
            rounded="lg"
            size="2xl"
            _hover={{
              bg: "#bc802d",
            }}
          >
            Browse Properties
          </Button>
          <Button
            bg="transparent"
            borderColor="#B9B9BB"
            size="2xl"
            rounded="lg"
            _hover={{
              bg: "whiteAlpha.300",
            }}
          >
            List Your Home
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
