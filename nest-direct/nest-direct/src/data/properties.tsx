import type { StaticImageData } from "next/image";

//property images
import property1 from "../assets/property1.jpg";
import property2 from "../assets/property2.jpg";
import property3 from "../assets/property3.jpg";
import property4 from "../assets/property4.jpg";
import property5 from "../assets/property5.jpg";
import property6 from "../assets/property6.jpg";

export interface Property {
  id: string;
  image: string | StaticImageData;
  images: (string | StaticImageData)[];
  price: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  tag?: string;
  description: string;
  features: string[];
  seller: {
    name: string;
    phone: string;
    since: string;
  };
}

export const properties: Property[] = [
  {
    id: "skyline-penthouse",
    image: property1,
    images: [property1, property2, property3],
    price: "$1,250,000",
    title: "Skyline Penthouse with Panoramic Views",
    location: "Manhattan, New York",
    beds: 3,
    baths: 2,
    sqft: "2,100 sq ft",
    tag: "Featured",
    description:
      "Experience breathtaking panoramic views of the Manhattan skyline from this stunning penthouse. Floor-to-ceiling windows flood every room with natural light, while premium finishes and an open floor plan create an atmosphere of effortless luxury. The chef's kitchen features top-of-the-line appliances and a waterfall island, perfect for entertaining. A private terrace wraps around the living area, offering an unparalleled outdoor experience in the heart of the city.",
    features: [
      "Floor-to-ceiling windows",
      "Private wrap-around terrace",
      "Chef's kitchen with Sub-Zero & Wolf",
      "In-unit washer/dryer",
      "24/7 doorman & concierge",
      "Heated rooftop pool",
      "Private parking space",
      "Smart home system",
    ],
    seller: { name: "Olivia Chen", phone: "(212) 555-0147", since: "2023" },
  },
  {
    id: "charming-family-home",
    image: property2,
    images: [property2, property4, property6],
    price: "$485,000",
    title: "Charming Family Home with Garden",
    location: "Oak Park, Illinois",
    beds: 4,
    baths: 2,
    sqft: "1,800 sq ft",
    description:
      "A beautifully maintained family home nestled on a tree-lined street in the heart of Oak Park. This classic residence features hardwood floors throughout, a spacious living room with a wood-burning fireplace, and a sun-drenched kitchen that opens to a landscaped backyard — perfect for children and weekend barbecues.",
    features: [
      "Hardwood floors throughout",
      "Wood-burning fireplace",
      "Landscaped backyard",
      "Attached two-car garage",
      "Finished basement",
      "Updated electrical & plumbing",
    ],
    seller: { name: "Marcus Johnson", phone: "(312) 555-0289", since: "2022" },
  },
  {
    id: "luxury-penthouse-rooftop",
    image: property3,
    images: [property3, property1, property5],
    price: "$3,200,000",
    title: "Luxury Penthouse with Rooftop Pool",
    location: "Downtown, Chicago",
    beds: 4,
    baths: 3,
    sqft: "3,500 sq ft",
    tag: "Premium",
    description:
      "This extraordinary penthouse redefines urban luxury with a private rooftop pool, sweeping lake views, and world-class finishes. The open-concept living space is bathed in light and anchored by a designer kitchen. A private elevator opens directly into the residence, ensuring absolute privacy and convenience.",
    features: [
      "Private rooftop pool & deck",
      "Lake Michigan views",
      "Private elevator entry",
      "Wine cellar",
      "Home theater",
      "Spa-inspired master bath",
      "Two private parking spaces",
      "Pet-friendly building",
    ],
    seller: { name: "Elena Vasquez", phone: "(312) 555-0412", since: "2024" },
  },
  {
    id: "stone-cottage",
    image: property4,
    images: [property4, property2, property6],
    price: "$325,000",
    title: "Cozy Stone Cottage in the Countryside",
    location: "Cotswolds, England",
    beds: 2,
    baths: 1,
    sqft: "1,200 sq ft",
    tag: "New",
    description:
      "A quintessential English countryside retreat, this honey-stone cottage blends period charm with modern comfort. Exposed beams, a farmhouse kitchen, and a cozy inglenook fireplace create an irresistibly warm atmosphere. The private garden backs onto rolling meadows with walking paths.",
    features: [
      "Original stone walls & beams",
      "Inglenook fireplace",
      "Country-style kitchen",
      "Private garden",
      "Oil-fired central heating",
      "Close to village amenities",
    ],
    seller: {
      name: "James Whitfield",
      phone: "+44 7700 900123",
      since: "2024",
    },
  },
  {
    id: "oceanfront-beach-house",
    image: property5,
    images: [property5, property3, property1],
    price: "$2,800,000",
    title: "Oceanfront Beach House with Sunset Deck",
    location: "Malibu, California",
    beds: 5,
    baths: 4,
    sqft: "4,200 sq ft",
    description:
      "Wake up to the sound of waves in this stunning oceanfront residence. The expansive sunset deck stretches the full width of the home, offering unobstructed views of the Pacific. Walls of glass blur the line between indoors and out, while natural materials and a neutral palette keep the focus on the breathtaking scenery.",
    features: [
      "Direct ocean access",
      "Full-width sunset deck",
      "Open-concept living",
      "Outdoor shower",
      "Home gym",
      "Three-car garage",
      "Solar panels",
      "Gated community",
    ],
    seller: { name: "Sophia Martinez", phone: "(310) 555-0578", since: "2023" },
  },
  {
    id: "european-townhouse",
    image: property6,
    images: [property6, property4, property2],
    price: "$890,000",
    title: "Elegant European Townhouse",
    location: "Le Marais, Paris",
    beds: 3,
    baths: 2,
    sqft: "1,600 sq ft",
    description:
      "An exquisite townhouse tucked away in the historic Le Marais district. Soaring ceilings, herringbone parquet floors, and ornate moldings speak to its 18th-century heritage, while a sleek renovation has added every modern convenience. A private courtyard garden offers a rare oasis of calm in the heart of Paris.",
    features: [
      "18th-century architecture",
      "Herringbone parquet floors",
      "Private courtyard garden",
      "Marble fireplaces",
      "Modern kitchen renovation",
      "Wine storage",
    ],
    seller: {
      name: "Antoine Dubois",
      phone: "+33 6 12 34 56 78",
      since: "2022",
    },
  },
];
