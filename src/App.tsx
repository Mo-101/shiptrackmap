
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ShipmentDetail from "./pages/ShipmentDetail";
import { AFRICAN_SHIPMENTS } from "./data/africanShipments";

const queryClient = new QueryClient();

// Wrapper component to handle finding shipments and redirecting if needed
const ShipmentDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const shipment = AFRICAN_SHIPMENTS.find(s => s.id === id);
  
  if (!shipment) {
    // If shipment not found, redirect to dashboard
    return <Navigate to="/" replace />;
  }
  
  return <ShipmentDetail shipment={shipment} />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shipment/:id" element={<ShipmentDetailWrapper />} />
            {/* Redirect any track requests to the dashboard with the shipment ID */}
            <Route path="/track/:id" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
