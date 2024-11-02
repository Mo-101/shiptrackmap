export interface Shipment {
  id: string;
  name: string;
  type: 'ship' | 'charter';
  origin: {
    name: string;
    coordinates: [number, number];
  };
  destination: {
    name: string;
    coordinates: [number, number];
  };
  status: 'in-transit' | 'delivered' | 'delayed';
  eta: string;
}