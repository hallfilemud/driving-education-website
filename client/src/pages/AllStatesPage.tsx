import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Search, MapPin, List, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import USAMap from "@/components/states/USAMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface State {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
}

export default function AllStatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [, setLocation] = useLocation();

  const { data: states, isLoading } = useQuery<State[]>({
    queryKey: ["/api/states"],
  });

  const filteredStates = states?.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateClick = (stateCode: string) => {
    setLocation(`/states/${stateCode.toLowerCase()}`);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All States Driver Resources</h1>
          <p className="text-neutral-600">
            Select a state to view driver resources and practice tests
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              className="pl-10 bg-white"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex">
            <Tabs defaultValue="map" onValueChange={(v) => setViewMode(v as "map" | "list")}>
              <TabsList className="grid w-full grid-cols-2 h-10">
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <Map className="h-4 w-4" />
                  <span>Map</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <List className="h-4 w-4" />
                  <span>List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
              className="flex items-center gap-2"
            >
              {viewMode === "map" ? (
                <>
                  <List className="h-4 w-4" />
                  <span>Show List</span>
                </>
              ) : (
                <>
                  <Map className="h-4 w-4" />
                  <span>Show Map</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {viewMode === "map" && (
          <div className="mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9] relative">
                <USAMap 
                  className="w-full h-full" 
                  onStateClick={handleStateClick}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground mt-4">
                <MapPin className="h-4 w-4 inline-block mr-1" />
                Click on any state to view its driver resources
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(9)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ))
            : filteredStates?.map((state) => (
                <Link key={state.id} href={`/states/${state.abbreviation.toLowerCase()}`}>
                    <Card className="h-full bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer border-muted">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <h2 className="text-xl font-semibold">{state.name}</h2>
                          <span className="text-neutral-500 font-medium">{state.abbreviation}</span>
                        </div>
                        <p className="text-neutral-600 text-sm flex-grow line-clamp-3">
                          {state.description}
                        </p>
                        <div className="mt-4 flex justify-end">
                          <span className="text-primary font-medium text-sm">View Resources</span>
                        </div>
                      </CardContent>
                    </Card>
                </Link>
              ))}
        </div>

        {filteredStates?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-neutral-500">No states found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}