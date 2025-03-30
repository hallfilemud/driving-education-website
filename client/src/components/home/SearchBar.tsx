import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { useOutsideClick } from "@/lib/utils";

interface SearchResult {
  states: Array<{
    id: number;
    name: string;
    abbreviation: string;
    description: string;
  }>;
  resources: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
  }>;
  drivingTips: Array<{
    id: number;
    title: string;
    content: string;
    category: string;
  }>;
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(searchContainerRef, () => {
    setIsResultsVisible(false);
  });

  const { data, isLoading, refetch } = useQuery<SearchResult>({
    queryKey: ['/api/search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return { states: [], resources: [], drivingTips: [] };
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: false
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2) {
        refetch();
        setIsResultsVisible(true);
      } else {
        setIsResultsVisible(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, refetch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const hasResults = data && (
    (data.states && data.states.length > 0) || 
    (data.resources && data.resources.length > 0) || 
    (data.drivingTips && data.drivingTips.length > 0)
  );

  return (
    <section className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative" ref={searchContainerRef}>
          <div className="flex items-center bg-neutral-100 rounded-lg px-4 py-2">
            <Search className="h-5 w-5 text-neutral-400" />
            <Input 
              type="text" 
              placeholder="Search for DMV information, driving tips, or state resources..." 
              className="w-full bg-transparent border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none pl-3 py-2 text-neutral-800 placeholder-neutral-400"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => {
                if (searchTerm.length >= 2) {
                  setIsResultsVisible(true);
                }
              }}
            />
          </div>

          {isResultsVisible && (
            <Card className="absolute z-20 w-full mt-1 max-h-[60vh] overflow-auto shadow-lg">
              <CardContent className="p-4">
                {isLoading && <p className="p-2 text-center">Searching...</p>}
                
                {!isLoading && !hasResults && searchTerm.length >= 2 && (
                  <p className="p-2 text-center">No results found for "{searchTerm}"</p>
                )}

                {!isLoading && hasResults && (
                  <div className="space-y-4">
                    {data?.states.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-500 uppercase mb-2">States</h3>
                        <ul className="space-y-2">
                          {data.states.slice(0, 3).map(state => (
                            <li key={state.id}>
                              <Link 
                                href={`/states/${state.abbreviation.toLowerCase()}`}
                                className="block p-2 hover:bg-neutral-100 rounded"
                                onClick={() => setIsResultsVisible(false)}
                              >
                                <span className="font-medium">{state.name}</span>
                                <p className="text-sm text-neutral-500 truncate">{state.description}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {data.states.length > 3 && (
                          <div className="mt-2 text-right">
                            <Link
                              href="/states"
                              className="text-primary text-sm font-medium hover:underline"
                              onClick={() => setIsResultsVisible(false)}
                            >
                              View all {data.states.length} matching states →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {data?.resources.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-500 uppercase mb-2">Resources</h3>
                        <ul className="space-y-2">
                          {data.resources.map(resource => (
                            <li key={resource.id}>
                              <Link 
                                href={`/states/ca?resource=${resource.id}`}
                                className="block p-2 hover:bg-neutral-100 rounded"
                                onClick={() => setIsResultsVisible(false)}
                              >
                                <span className="font-medium">{resource.title}</span>
                                <p className="text-sm text-neutral-500 truncate">{resource.description}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {data?.drivingTips.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-500 uppercase mb-2">Driving Tips</h3>
                        <ul className="space-y-2">
                          {data.drivingTips.map(tip => (
                            <li key={tip.id}>
                              <Link
                                href="/driving-tips"
                                className="block p-2 hover:bg-neutral-100 rounded"
                                onClick={() => setIsResultsVisible(false)}
                              >
                                <span className="font-medium">{tip.title}</span>
                                <p className="text-sm text-neutral-500 truncate">{tip.content.substring(0, 80)}...</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
