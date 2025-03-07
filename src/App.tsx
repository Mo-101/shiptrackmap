
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ShipmentDetail from "./pages/ShipmentDetail";
import { AFRICAN_SHIPMENTS } from "./data/africanShipments";

const queryClient = new QueryClient();

const App = () => {
  // Find the shipment by ID when navigating to a specific shipment
  const findShipmentById = (id: string) => {
    return AFRICAN_SHIPMENTS.find(shipment => shipment.id === id);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/shipment/:id" 
              element={
                <ShipmentDetail 
                  shipment={
                    findShipmentById(window.location.pathname.split('/').pop() || '')
                  } 
                />
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
