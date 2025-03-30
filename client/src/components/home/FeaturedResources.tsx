import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileSize?: string;
  featured: boolean;
  category: string;
  stateId: number | null;
  imageUrl?: string;
  isNew: boolean;
}

export default function FeaturedResources() {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources/featured'],
  });

  return (
    <section className="py-12 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Featured Resources</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Popular guides and test materials to help you prepare for your driver's test.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {resources?.map((resource) => (
              <Card key={resource.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="h-48 bg-neutral-200 relative">
                  {resource.imageUrl && (
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${resource.imageUrl})` }}
                    />
                  )}
                  {resource.isNew && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#F59E0B] text-white text-sm font-medium py-1 px-3 rounded-full">
                        New
                      </Badge>
                    </div>
                  )}
                  {!resource.isNew && resource.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-white text-sm font-medium py-1 px-3 rounded-full">
                        Popular
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-neutral-600 mb-4">{resource.description}</p>
                  <div className="flex justify-between items-center">
                    <a 
                      href={resource.fileUrl} 
                      className="text-primary font-medium flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download PDF
                      <Download className="h-5 w-5 ml-1" />
                    </a>
                    {resource.fileSize && (
                      <span className="text-neutral-400 text-sm">{resource.fileSize}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
