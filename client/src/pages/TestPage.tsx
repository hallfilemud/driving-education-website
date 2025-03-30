import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PracticeTest from "@/components/tests/PracticeTest";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Award, BookOpen, ListChecks } from "lucide-react";

interface State {
  id: number;
  name: string;
  abbreviation: string;
}

export default function TestPage() {
  const { category } = useParams<{ category?: string }>();
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(undefined);
  
  // Default to "general" if no category is specified
  const activeCategory = category || "general";
  
  // Fetch all states for the dropdown
  const { data: states } = useQuery<State[]>({
    queryKey: ['/api/states'],
  });
  
  const handleStateChange = (value: string) => {
    setSelectedStateId(value === "all" ? undefined : parseInt(value));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Driver's License Practice Tests</h1>
        <p className="text-neutral-600 mb-6">
          Prepare for your driving test with our comprehensive practice questions. Select a test category and state below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-2 bg-blue-50 text-blue-600 border-blue-200">
                NEW FEATURE
              </Badge>
              <CardTitle>Full Practice Tests</CardTitle>
              <CardDescription>
                Simulate a real DMV exam with our comprehensive 10+ question tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Answer all questions before seeing your score</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Detailed explanations for each answer</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Pass/fail scoring similar to actual tests</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-2 bg-orange-50 text-orange-600 border-orange-200">
                POPULAR
              </Badge>
              <CardTitle>Study Modes Available</CardTitle>
              <CardDescription>
                Choose the learning style that works best for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Award className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Practice Mode:</strong> Immediate feedback after each question</span>
                </li>
                <li className="flex items-start">
                  <ListChecks className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Full Test Mode:</strong> Complete all questions before seeing results</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>State-Specific:</strong> Questions tailored to your state's rules</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <label htmlFor="state-select" className="block text-sm font-medium text-neutral-700 mb-2">
            Select a State for Specific Questions:
          </label>
          <Select onValueChange={handleStateChange} defaultValue="all">
            <SelectTrigger className="w-full md:w-72">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-60">
                <SelectItem value="all">All States (General)</SelectItem>
                {states?.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <p className="text-sm text-neutral-500 mt-1">
            {selectedStateId 
              ? "Showing state-specific questions" 
              : "Showing general knowledge questions applicable to all states"}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue={activeCategory} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General Knowledge</TabsTrigger>
          <TabsTrigger value="signs">Road Signs</TabsTrigger>
          <TabsTrigger value="parking">Parking & Maneuvers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <PracticeTest category="General Knowledge" stateId={selectedStateId} />
        </TabsContent>
        
        <TabsContent value="signs">
          <PracticeTest category="Road Signs" stateId={selectedStateId} />
        </TabsContent>
        
        <TabsContent value="parking">
          <PracticeTest category="Parking & Maneuvers" stateId={selectedStateId} />
        </TabsContent>
      </Tabs>
      
      <AdPlaceholder className="mt-8" />
    </div>
  );
}
