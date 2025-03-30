import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface State {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  resourceUrl?: string;
  manualUrl?: string;
}

export default function StateSelector() {
  const [showAllStates, setShowAllStates] = useState(true); // Default to showing all states

  const { data: states, isLoading } = useQuery<State[]>({
    queryKey: ['/api/states'],
  });

  const toggleShowAllStates = () => {
    setShowAllStates(prev => !prev);
  };

  // Show all states by default, or just 10 if showAllStates is false
  const displayedStates = showAllStates ? states : states?.slice(0, 10);

  return (
    <section id="state-resources" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Select Your State</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Find state-specific driving resources, manuals, and practice tests for all 50 states.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedStates?.map((state) => (
              <Link 
                key={state.id} 
                href={`/states/${state.abbreviation.toLowerCase()}`}
                className="bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 rounded-lg p-4 text-center"
              >
                <div className="text-primary font-medium">{state.name}</div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center flex flex-col items-center space-y-4">
          {states && states.length > 10 && (
            <Button
              variant="ghost"
              className="text-primary hover:text-primary-dark font-medium"
              onClick={toggleShowAllStates}
            >
              {showAllStates ? "Show Less" : "Show all 50 States"}
              <ChevronDown className={`h-5 w-5 inline-block ml-1 ${showAllStates ? "rotate-180 transform" : ""}`} />
            </Button>
          )}
          
          <Link href="/states">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All State Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
