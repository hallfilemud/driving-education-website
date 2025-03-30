import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface Question {
  id: number;
  stateId: number | null;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function SampleQuestions() {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ['/api/questions/category/General Knowledge'],
  });

  const toggleAnswer = (questionId: number) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Display only up to 2 sample questions
  const sampleQuestions = questions?.slice(0, 2);

  return (
    <section className="py-12 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Sample Test Questions</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Try these sample questions to get a feel for the actual DMV written test.
          </p>
        </div>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          {isLoading ? (
            Array(2).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-4" />
                  {Array(4).fill(0).map((_, optIndex) => (
                    <div key={optIndex} className="flex items-start mb-3">
                      <Skeleton className="h-4 w-4 mr-3 mt-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                  <Skeleton className="h-10 w-28 mt-4" />
                </CardContent>
              </Card>
            ))
          ) : (
            sampleQuestions?.map(question => (
              <Card key={question.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                  
                  <RadioGroup 
                    value={selectedAnswers[question.id]} 
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                    className="space-y-3 mb-6"
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-start">
                        <RadioGroupItem id={`q${question.id}-${index}`} value={option} className="mt-1 mr-3" />
                        <Label htmlFor={`q${question.id}-${index}`} className="text-neutral-700">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {revealedAnswers[question.id] && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-green-700 font-medium">Correct Answer: {question.correctAnswer}</p>
                          <p className="text-green-600 mt-1">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost"
                    className="mt-2 text-primary font-medium"
                    onClick={() => toggleAnswer(question.id)}
                  >
                    {revealedAnswers[question.id] ? "Hide Answer" : "Show Answer"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/practice-tests/general">
            <Button className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Try Full Practice Test
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
