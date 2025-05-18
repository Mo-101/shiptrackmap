import { useState, useEffect } from 'react';

export type ShipmentRecord = {
  request_reference: string;
  [key: string]: any;
};

export function useHistoricalShipments(): ShipmentRecord[] {
  const [data, setData] = useState<ShipmentRecord[]>([]);

  useEffect(() => {
    fetch('/src/symbolic-engine/core/base_data/deeptrack_3.json')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  return data;
}

export function useShipmentByReference(ref: string): ShipmentRecord | undefined {
  const data = useHistoricalShipments();
  return data.find((row) => row.request_reference === ref);
}
