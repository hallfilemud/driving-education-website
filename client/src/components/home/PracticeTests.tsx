import { Link } from "wouter";
import { CheckCircle, AlertTriangle, Building } from "lucide-react";

export default function PracticeTests() {
  const testCategories = [
    {
      id: "general",
      title: "General Knowledge Test",
      description: "Test your knowledge of basic driving rules, road signs, and safety practices.",
      questionsCount: 50,
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      iconBgClass: "bg-primary"
    },
    {
      id: "signs",
      title: "Road Signs Test",
      description: "Practice identifying and understanding traffic signs, signals, and road markings.",
      questionsCount: 30,
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
      iconBgClass: "bg-[#10B981]"
    },
    {
      id: "parking",
      title: "Parking & Maneuvers",
      description: "Test your knowledge of parking rules, turning procedures, and special maneuvers.",
      questionsCount: 25,
      icon: <Building className="h-6 w-6 text-white" />,
      iconBgClass: "bg-[#F59E0B]"
    }
  ];

  return (
    <section id="practice-tests" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Practice Tests</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Prepare for your driver's license test with our comprehensive practice questions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCategories.map((category) => (
            <div key={category.id} className="bg-neutral-100 rounded-xl overflow-hidden transition-all duration-300 hover:bg-neutral-200">
              <Link href={`/practice-tests/${category.id}`} className="block p-6">
                <div className="flex items-center mb-4">
                  <div className={`${category.iconBgClass} rounded-full p-3 mr-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
                <p className="text-neutral-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">{category.questionsCount} Questions</span>
                  <span className="text-primary font-medium">Start Test →</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/practice-tests" className="inline-flex items-center text-primary font-medium hover:underline">
            View All Practice Tests
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
