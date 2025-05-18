
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import DeepCAL from "./pages/DeepCAL";
import DeepCALChat from "./pages/DeepCALChat";
import TrainingPage from "./pages/TrainingPage";
import NavHeader from "./components/NavHeader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavHeader toggleSidebar={() => {}} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shipment/:id" element={<Index />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/deepcal" element={<DeepCAL />} />
          <Route path="/deepcalchat" element={<DeepCALChat />} />
          <Route path="/training" element={<TrainingPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
