import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface TestQuestionProps {
  question: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  showResult: boolean;
}

export default function TestQuestion({ question, onAnswer, showResult }: TestQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(showResult);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Update when showResult prop changes
  useEffect(() => {
    setIsAnswered(showResult);
  }, [showResult]);
  
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };
  
  const checkAnswer = () => {
    if (!selectedAnswer || isAnswered) return;
    
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(correct);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        
        <div className="mt-1 mb-3 p-3 bg-blue-50 text-blue-600 rounded-md border border-blue-200">
          <p className="font-medium">Instructions:</p>
          <p>1. Select one of the answers below.</p>
          <p>2. Click the "Submit Answer" button to check if you're correct.</p>
        </div>
        
        <RadioGroup 
          value={selectedAnswer || ""}
          onValueChange={handleAnswerSelect}
          className="space-y-3 mb-6"
          disabled={isAnswered}
        >
          {question.options.map((option, index) => (
            <div key={index} className={`flex items-start p-3 rounded-md border ${
              isAnswered && option === question.correctAnswer 
                ? 'bg-green-50 border-green-200' 
                : isAnswered && option === selectedAnswer && option !== question.correctAnswer
                  ? 'bg-red-50 border-red-200'
                  : selectedAnswer === option
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <RadioGroupItem 
                id={`q${question.id}-${index}`} 
                value={option} 
                className="mt-1 mr-3"
                disabled={isAnswered}
              />
              <Label 
                htmlFor={`q${question.id}-${index}`} 
                className={`flex-grow ${
                  isAnswered && option === question.correctAnswer 
                    ? 'text-green-700 font-medium' 
                    : isAnswered && option === selectedAnswer && option !== question.correctAnswer
                      ? 'text-red-700 font-medium'
                      : selectedAnswer === option
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                }`}
              >
                {option}
                {isAnswered && option === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2 inline" />
                )}
                {isAnswered && option === selectedAnswer && option !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500 ml-2 inline" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {isAnswered && (
          <div className={`p-4 rounded-lg border ${
            selectedAnswer === question.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-1" />
              )}
              <div>
                <p className={`font-medium ${selectedAnswer === question.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedAnswer === question.correctAnswer 
                    ? 'Correct!' 
                    : `Incorrect. The correct answer is: ${question.correctAnswer}`}
                </p>
                <p className="mt-2 text-gray-700">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!isAnswered && (
          <div className="mt-6">
            {selectedAnswer && (
              <p className="text-gray-600 mb-2">
                You selected: <span className="font-semibold">{selectedAnswer}</span>
              </p>
            )}
            
            <Button 
              onClick={checkAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
              size="lg"
            >
              {!selectedAnswer ? "Select an Answer Above" : "Submit Answer"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}