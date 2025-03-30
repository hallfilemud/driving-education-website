import { Link } from "wouter";
import { Zap, Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Zap className="h-7 w-7 text-primary" />
              <span className="ml-2 text-xl font-bold">DriveGuideUSA</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Your comprehensive resource for driver's license information and test preparation across all 50 states.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-white">Home</Link></li>
              <li><Link href="/states/ca" className="text-neutral-400 hover:text-white">State Resources</Link></li>
              <li><Link href="/practice-tests" className="text-neutral-400 hover:text-white">Practice Tests</Link></li>
              <li><Link href="/driving-tips" className="text-neutral-400 hover:text-white">Driving Tips</Link></li>
              <li><Link href="/about" className="text-neutral-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/states/ca" className="text-neutral-400 hover:text-white">Road Signs Guide</Link></li>
              <li><Link href="/states/ca" className="text-neutral-400 hover:text-white">California Driver's Handbook</Link></li>
              <li><Link href="/driving-tips" className="text-neutral-400 hover:text-white">Parallel Parking Tips</Link></li>
              <li><Link href="/practice-tests" className="text-neutral-400 hover:text-white">DMV Test Preparation</Link></li>
              <li><Link href="/driving-tips" className="text-neutral-400 hover:text-white">New Driver Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-neutral-400 mr-2 mt-0.5" />
                <span className="text-neutral-400">support@driveguideusa.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-neutral-400 mr-2 mt-0.5" />
                <span className="text-neutral-400">(555) 123-4567</span>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-10 pt-6 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} DriveGuideUSA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
