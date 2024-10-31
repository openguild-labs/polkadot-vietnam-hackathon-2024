import { Button } from "@/components/ui/button";
import { ConnectButtonWrapper } from "@/components/connect-button";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Web3 Event Ticketing
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Secure, transparent, and decentralized event ticketing on the
              Unique blockchain.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button>Browse Events</Button>
              <ConnectButtonWrapper />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
