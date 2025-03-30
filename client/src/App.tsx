import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import StatePage from "@/pages/StatePage";
import AllStatesPage from "@/pages/AllStatesPage";
import TestPage from "@/pages/TestPage";
import DrivingTipsPage from "@/pages/DrivingTipsPage";
import AboutPage from "@/pages/AboutPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/states" component={AllStatesPage} />
      <Route path="/states/:abbreviation" component={StatePage} />
      <Route path="/practice-tests/:category?" component={TestPage} />
      <Route path="/driving-tips" component={DrivingTipsPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
