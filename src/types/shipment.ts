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
    country: string;
  };
  status: 'in-transit' | 'delivered' | 'delayed';
  eta: string;
  consigneeAddress: string;
  ops: string;
  itemCategory: string;
  itemDescription: string;
  weight: string;
}