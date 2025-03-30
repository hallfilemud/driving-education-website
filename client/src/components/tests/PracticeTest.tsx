import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import TestQuestion from "./TestQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, RefreshCw, Check, ListChecks, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  stateId: number | null;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface PracticeTestProps {
  category?: string;
  stateId?: number;
}

export default function PracticeTest({ category = "General Knowledge", stateId }: PracticeTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [testMode, setTestMode] = useState<"practice" | "full">("practice");

  const { toast } = useToast();

  // Determine the endpoint based on if we have a stateId or a category
  const queryKey = stateId 
    ? [`/api/states/${stateId}/questions`]
    : [`/api/questions/category/${category}`];

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey,
  });

  // Calculate the progress percentage
  const progressPercentage = questions && questions.length > 0
    ? (answeredQuestions.length / questions.length) * 100
    : 0;

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Add current question to answered questions
    if (!answeredQuestions.includes(currentQuestionIndex)) {
      setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
    }
    
    // In practice mode, if all questions are answered, show results
    if (testMode === "practice" && questions && answeredQuestions.length === questions.length - 1) {
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitTest = () => {
    setShowResults(true);
  };

  const switchTestMode = (mode: "practice" | "full") => {
    setTestMode(mode);
    restartTest();
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setShowResults(false);
    setAnsweredQuestions([]);
    toast({
      title: "Test Restarted",
      description: "Good luck on your new attempt!",
    });
  };

  // Determine if the current question has been answered
  const isCurrentQuestionAnswered = answeredQuestions.includes(currentQuestionIndex);

  // Calculate the passing score (typically 80% is passing)
  const totalQuestions = questions?.length || 0;
  const passingScore = Math.ceil(totalQuestions * 0.8);
  const hasPassed = correctAnswers >= passingScore;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Check if we have enough questions answered to enable the submit button
  const canSubmitTest = answeredQuestions.length >= Math.min(10, totalQuestions);
  
  // Check if all questions have been answered
  const allQuestionsAnswered = questions && answeredQuestions.length === questions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isLoading ? (
        <>
          <div className="mb-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-64 w-full mb-6" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </>
      ) : questions && questions.length > 0 ? (
        <>
          {!showResults ? (
            <>
              <div className="mb-6">
                <Tabs defaultValue="practice" className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="practice" 
                      onClick={() => switchTestMode("practice")}
                      disabled={testMode === "practice" && answeredQuestions.length > 0}
                    >
                      Practice Mode
                    </TabsTrigger>
                    <TabsTrigger 
                      value="full" 
                      onClick={() => switchTestMode("full")}
                      disabled={testMode === "full" && answeredQuestions.length > 0}
                    >
                      Full Test
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="practice" className="mt-4">
                    <p className="text-neutral-600">
                      Go through questions one by one with immediate feedback. Great for learning.
                    </p>
                  </TabsContent>
                  <TabsContent value="full" className="mt-4">
                    <p className="text-neutral-600">
                      Answer all questions and submit at the end. Simulates a real driving test.
                    </p>
                  </TabsContent>
                </Tabs>

                <h1 className="text-2xl font-bold mb-2">
                  {stateId ? "State-Specific " : ""}{category} {testMode === "full" ? "Full Test" : "Practice Test"}
                </h1>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-neutral-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                  <Badge variant="outline" className="ml-2">
                    {answeredQuestions.length} of {questions.length} answered
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <TestQuestion 
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                showResult={testMode === "practice" ? isCurrentQuestionAnswered : false}
              />

              <AdPlaceholder size="small" className="py-2" />

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {testMode === "full" && (
                  <Button
                    onClick={submitTest}
                    variant="default"
                    className="mx-2 bg-green-600 hover:bg-green-700"
                    disabled={!canSubmitTest}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {canSubmitTest ? "Submit Test" : `Answer ${Math.min(10, totalQuestions) - answeredQuestions.length} More Question(s)`}
                  </Button>
                )}

                <Button
                  onClick={handleNextQuestion}
                  disabled={
                    testMode === "practice" 
                      ? (currentQuestionIndex === questions.length - 1 || !isCurrentQuestionAnswered)
                      : currentQuestionIndex === questions.length - 1
                  }
                >
                  Next
                </Button>
              </div>
              
              {testMode === "full" && allQuestionsAnswered && (
                <div className="mt-4 text-center">
                  <Button
                    onClick={submitTest}
                    variant="default"
                    size="lg"
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  >
                    <ListChecks className="mr-2 h-5 w-5" />
                    All Questions Answered - Submit Test
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  hasPassed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Trophy className={`h-10 w-10 ${
                    hasPassed ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {hasPassed ? 'Congratulations!' : 'Nice Try!'}
                </h2>
                
                <p className="text-xl mb-4">
                  You scored {correctAnswers} out of {totalQuestions} ({scorePercentage}%)
                </p>
                
                <p className={`font-medium mb-6 ${
                  hasPassed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {hasPassed 
                    ? 'You passed! You\'re well prepared for your driving test.' 
                    : `You need ${passingScore} correct answers to pass. Keep practicing!`}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button
                    onClick={restartTest}
                    className="mb-3 sm:mb-0"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Take Test Again
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (testMode === "practice") {
                        switchTestMode("full");
                      } else {
                        switchTestMode("practice");
                      }
                    }}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Switch to {testMode === "practice" ? "Full" : "Practice"} Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600">No questions available for this category.</p>
        </div>
      )}
    </div>
  );
}
