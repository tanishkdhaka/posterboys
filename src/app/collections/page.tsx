import type { Metadata } from "next";
import CollectionClient from "./CollectionClient"; // we'll create this next

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "All Poster Categories",
  description: "Explore all poster categories...",
  alternates: {
    canonical: "https://posterboys.store/collection"
  }
});

export default function CollectionPage() {
  return <CollectionClient />;
}
