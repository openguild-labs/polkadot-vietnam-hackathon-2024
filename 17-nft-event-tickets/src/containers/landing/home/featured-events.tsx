import { EventCard } from "@/components/event-card";
interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image: string;
  category: string;
}

interface FeaturedEventsProps {
  events: Event[];
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-5xl text-center font-bold tracking-tighter lg:text-4xl">
          Featured Events
        </h2>
        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
