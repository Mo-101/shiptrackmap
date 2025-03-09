
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate, useSearchParams } from "react-router-dom";
import Index from "./pages/Index";
import ShipmentDetail from "./pages/ShipmentDetail";
import { AFRICAN_SHIPMENTS } from "./data/africanShipments";
import "./App.css";

// Create a client with modified default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
  
  // We'll redirect to the dashboard with a track parameter
  return <Navigate to={`/?track=${id}`} replace />;
};

const App = () => {
  console.log("App initializing...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shipment/:id" element={<ShipmentDetailWrapper />} />
              <Route path="/track/:id" element={<TrackingHandler />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
