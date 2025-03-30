import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DrivingTip {
  id: number;
  title: string;
  content: string;
  category: string;
}

export default function DrivingTips() {
  const { data: tips, isLoading } = useQuery<DrivingTip[]>({
    queryKey: ['/api/driving-tips'],
  });

  return (
    <section id="driving-tips" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Safe Driving Tips</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Essential advice for new and experienced drivers to stay safe on the road.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {tips?.map((tip) => (
              <div key={tip.id} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-primary bg-opacity-10 rounded-full p-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                  <p className="text-neutral-600">{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Link 
            href="/driving-tips" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            View All Driving Tips
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
