import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Newsletter from "@/components/layout/Newsletter";
import { Car, BookOpen, Shield, HelpCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About DriveGuideUSA</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted resource for driver's license information, test preparation, and safe driving tips across the United States.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-neutral-600 mb-8">
            At DriveGuideUSA, our mission is to provide comprehensive, accurate, and accessible information about driver's licensing 
            requirements and procedures throughout all 50 states. We believe that well-prepared drivers make safer roads for everyone, 
            which is why we're dedicated to helping new and experienced drivers navigate the complex world of driving laws and best practices.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                  <h3 className="text-xl font-bold">Educational Resources</h3>
                </div>
                <p className="text-neutral-600">
                  We provide up-to-date driver's manuals, practice tests, and study materials for all 50 states, ensuring you have 
                  everything you need to prepare for your driver's license test.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Car className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                  <h3 className="text-xl font-bold">Driver Training</h3>
                </div>
                <p className="text-neutral-600">
                  Our platform includes tips and guides on driving techniques, road rules, and vehicle handling to help both new and 
                  experienced drivers improve their skills behind the wheel.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                  <h3 className="text-xl font-bold">Safety Advocacy</h3>
                </div>
                <p className="text-neutral-600">
                  We promote safe driving practices and awareness through educational content, seasonal driving tips, and information 
                  about the latest safety technologies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <HelpCircle className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                  <h3 className="text-xl font-bold">Community Support</h3>
                </div>
                <p className="text-neutral-600">
                  DriveGuideUSA aims to build a community of responsible drivers who support each other in maintaining safe roads for 
                  everyone across the United States.
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12" />

          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <p className="text-neutral-600 mb-4">
            DriveGuideUSA was founded by a team of driving instructors, traffic safety experts, and educational content specialists who 
            recognized the need for a centralized, reliable source of driver's license information across all states.
          </p>
          <p className="text-neutral-600 mb-12">
            Our content is regularly reviewed and updated by professionals in the field to ensure accuracy and compliance with the latest 
            regulations in each state.
          </p>

          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-neutral-600 mb-4">
            We're here to help with any questions about driving laws, licensing procedures, or our website resources.
          </p>
          <p className="text-neutral-600 mb-2">
            <strong>Email:</strong> support@driveguideusa.com
          </p>
          <p className="text-neutral-600 mb-12">
            <strong>Phone:</strong> (555) 123-4567
          </p>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
