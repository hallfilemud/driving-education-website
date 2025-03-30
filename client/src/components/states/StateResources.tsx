import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AdPlaceholder from "@/components/shared/AdPlaceholder";

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

interface State {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  resourceUrl?: string;
  manualUrl?: string;
}

interface StateResourcesProps {
  stateId: number;
  stateName: string;
}

export default function StateResources({ stateId, stateName }: StateResourcesProps) {
  const [activeTab, setActiveTab] = useState("resources");

  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: [`/api/states/${stateId}/resources`],
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<any[]>({
    queryKey: [`/api/states/${stateId}/questions`],
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{stateName} Driver Resources</h1>
            <p className="text-neutral-600">Everything you need to know about driving in {stateName}</p>
          </div>

          {resources?.some(r => r.category === "Driver's Manual") && (
            <div className="mt-4 md:mt-0">
              <Button 
                className="bg-primary text-white hover:bg-opacity-90"
                onClick={() => {
                  const manual = resources.find(r => r.category === "Driver's Manual");
                  if (manual?.fileUrl) {
                    window.open(manual.fileUrl, "_blank");
                  }
                }}
              >
                Download Driver's Manual
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 border-b border-neutral-200">
          <div className="flex space-x-6">
            <button
              className={`pb-2 px-1 font-medium ${
                activeTab === "resources"
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-600 hover:text-primary"
              }`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </button>
            <button
              className={`pb-2 px-1 font-medium ${
                activeTab === "practice"
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-600 hover:text-primary"
              }`}
              onClick={() => setActiveTab("practice")}
            >
              Practice Tests
            </button>
          </div>
        </div>

        {activeTab === "resources" && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {resourcesLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
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
                ))
              ) : resources?.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-neutral-500">No resources found for this state.</p>
                </div>
              ) : (
                resources?.map((resource) => (
                  <Card key={resource.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                    {resource.imageUrl ? (
                      <div className="h-40 relative">
                        <div 
                          className="w-full h-full bg-cover bg-center" 
                          style={{ backgroundImage: `url(${resource.imageUrl})` }}
                        />
                        {resource.isNew && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-[#F59E0B] text-white">New</Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-40 bg-neutral-100 flex items-center justify-center">
                        <p className="text-neutral-400">{resource.category}</p>
                      </div>
                    )}
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
                ))
              )}
            </div>

            <AdPlaceholder />
          </>
        )}

        {activeTab === "practice" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">{stateName} Practice Test Questions</h2>
              <p className="text-neutral-600 mb-6">
                Practice with actual questions from the {stateName} driver's test to prepare for your exam.
              </p>

              {questionsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-full mb-4" />
                        <div className="space-y-2">
                          {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center">
                              <Skeleton className="h-4 w-4 mr-3" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : questions?.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-neutral-500">No practice questions found for this state.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions?.slice(0, 3).map((question) => (
                    <Card key={question.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                        <div className="space-y-3 mb-4">
                          {question.options.map((option: string, index: number) => (
                            <div key={index} className="flex items-start">
                              <input type="radio" id={`q${question.id}-${index}`} name={`q${question.id}`} className="mt-1 mr-3" />
                              <label htmlFor={`q${question.id}-${index}`} className="text-neutral-700">{option}</label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <a href={`/practice-tests/general?state=${stateId}`}>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Take Full Practice Test
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <AdPlaceholder />
          </>
        )}
      </div>
    </div>
  );
}
