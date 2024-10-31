import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";

interface Ticket {
  title: string;
  description: string;
  date: string;
  location: string;
  tokenId: string;
  image: string;
}

interface MyTicketsProps {
  upcomingTickets: Ticket[];
  pastTickets: Ticket[];
}

export function MyTickets({ upcomingTickets, pastTickets }: MyTicketsProps) {
  const renderTicket = (ticket: Ticket) => (
    <Card key={ticket.tokenId} className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={ticket.image}
          alt={ticket.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{ticket.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {ticket.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{ticket.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span>{ticket.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <TicketIcon className="mr-2 h-4 w-4" />
            <span>Token ID: {ticket.tokenId}</span>
          </div>
        </div>
        <Badge variant="secondary" className="mt-4">
          NFT Ticket
        </Badge>
      </CardContent>
    </Card>
  );

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
          My Tickets
        </h2>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map(renderTicket)}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map(renderTicket)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
