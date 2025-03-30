import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import StateResources from "@/components/states/StateResources";
import NotFound from "@/pages/not-found";

interface State {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  resourceUrl?: string;
  manualUrl?: string;
}

export default function StatePage() {
  const { abbreviation } = useParams<{ abbreviation: string }>();
  const [, setLocation] = useLocation();

  const { data: state, isLoading, error } = useQuery<State>({
    queryKey: [`/api/states/${abbreviation}`],
  });

  // If the state is not found, redirect to 404
  useEffect(() => {
    if (!isLoading && !state && error) {
      setLocation("/not-found");
    }
  }, [isLoading, state, error, setLocation]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!state) {
    return <NotFound />;
  }

  return (
    <StateResources stateId={state.id} stateName={state.name} />
  );
}
