import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-primary text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Complete Guide to Driving in the USA</h1>
          <p className="text-lg md:text-xl mb-8">Resources for driving tests, license information, and road safety for all 50 states.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/states/ca">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100 font-medium py-3 px-6 rounded-lg text-center transition-colors duration-200">
                Find Your State
              </Button>
            </Link>
            <Link href="/practice-tests">
              <Button size="lg" className="bg-[#F59E0B] text-white hover:bg-opacity-90 font-medium py-3 px-6 rounded-lg text-center transition-colors duration-200">
                Practice Tests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
