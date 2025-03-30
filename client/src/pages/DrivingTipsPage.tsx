import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import AdPlaceholder from "@/components/shared/AdPlaceholder";

interface DrivingTip {
  id: number;
  title: string;
  content: string;
  category: string;
}

export default function DrivingTipsPage() {
  const { data: tips, isLoading } = useQuery<DrivingTip[]>({
    queryKey: ['/api/driving-tips'],
  });

  // Group tips by category
  const tipsByCategory: Record<string, DrivingTip[]> = {};
  
  if (tips) {
    tips.forEach(tip => {
      if (!tipsByCategory[tip.category]) {
        tipsByCategory[tip.category] = [];
      }
      tipsByCategory[tip.category].push(tip);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-800 mb-4">Safe Driving Tips</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Essential advice for new and experienced drivers to stay safe on the road.
          Bookmark this page and revisit it regularly to refresh your knowledge.
        </p>
      </div>

      <AdPlaceholder />

      {isLoading ? (
        <div className="mt-12 space-y-8">
          {Array(3).fill(0).map((_, categoryIndex) => (
            <div key={categoryIndex}>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, tipIndex) => (
                  <Card key={tipIndex}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {Object.entries(tipsByCategory).map(([category, categoryTips]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6">{category} Tips</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {categoryTips.map(tip => (
                  <Card key={tip.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-full p-2 mr-3">
                          <Plus className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">{tip.title}</h3>
                      </div>
                      <p className="text-neutral-600">{tip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Separator className="mt-10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
