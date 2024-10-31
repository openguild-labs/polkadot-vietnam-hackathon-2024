"use client";

import { Header } from "@/components/header";
import { Hero } from "@/containers/landing/home/hero";
import { FeaturedEvents } from "@/containers/landing/home/featured-events";
import { MyTickets } from "@/containers/landing/home/my-tickets";
import { Footer } from "@/components/footer";

export default function App() {
  const featuredEvents = [
    {
      title: "Unique Network Summit 2024",
      description: "The biggest Unique Network ecosystem event of the year",
      date: "June 15-17, 2024",
      location: "Virtual",
      price: 1,
      image:
        "https://unique.network/markup/dist/static/images/content/pages/unq-default.jpg",
      category: "Blockchain",
    },
    {
      title: "NFT Innovation on Unique",
      description: "Exploring advanced NFT features on Unique Network",
      date: "July 22-23, 2024",
      location: "Berlin, Germany",
      price: 1,
      image:
        "https://unique.network/markup/dist/static/images/content/pages/unq-default.jpg",
      category: "NFT",
    },
    {
      title: "Unique Network Gaming Festival",
      description: "Showcasing blockchain gaming projects built on Unique",
      date: "August 5, 2024",
      location: "Singapore",
      price: 1,
      image:
        "https://unique.network/markup/dist/static/images/content/pages/unq-default.jpg",
      category: "Gaming",
    },
  ];

  const upcomingTickets = [
    {
      title: "Unique Dev Workshop",
      description: "Technical workshop for Unique Network developers",
      date: "May 10, 2024",
      location: "Amsterdam, Netherlands",
      tokenId: 1,
      image:
        "https://unique.network/markup/dist/static/images/content/pages/unq-default.jpg",
      category: "Workshop",
    },
  ];

  const pastTickets = [
    {
      title: "Unique Network Hackathon",
      description: "Building the future of NFTs on Unique Network",
      date: "March 15, 2024",
      location: "Online",
      tokenId: 1,
      image:
        "https://unique.network/markup/dist/static/images/content/pages/unq-default.jpg",
      category: "Hackathon",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedEvents events={featuredEvents} />
        {/* <MyTickets
          upcomingTickets={upcomingTickets}
          pastTickets={pastTickets}
        /> */}
      </main>
      <Footer />
    </div>
  );
}
