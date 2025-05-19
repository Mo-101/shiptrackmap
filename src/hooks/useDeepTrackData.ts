import { useEffect, useState } from "react";

export default function useDeepTrackData() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("/deeptrack_3.json").then(r => r.json()).then(setData);
  }, []);
  return [data, setData] as const;
}
