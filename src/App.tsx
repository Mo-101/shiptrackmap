
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate, useSearchParams } from "react-router-dom";
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

// Tracking route handler
const TrackingHandler = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // We'll redirect to the dashboard with a track parameter
  return <Navigate to={`/?track=${id}`} replace />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Index />} />
            <Route path="/shipment/:id" element={<ShipmentDetailWrapper />} />
            <Route path="/track/:id" element={<TrackingHandler />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
