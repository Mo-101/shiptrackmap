
export interface Shipment {
  id: string;
  name: string;
  type: 'ship' | 'charter' | 'truck';
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
  volume?: string;
  value?: string;
  stockRelease?: string;
  whoDescription?: string;
  expirationDate?: string;
  serialNumber?: string;
  warehouse?: string;
}
