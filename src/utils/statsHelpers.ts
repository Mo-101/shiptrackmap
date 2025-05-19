// src/utils/statsHelpers.ts
export function getUniqueShipments(data: any[]) {
  const map = new Map();
  data.forEach(d => map.set(d.request_reference, d));
  return Array.from(map.values());
}

export function getTotals(data: any[]) {
  const shipments = getUniqueShipments(data);
  const totalWeight = shipments.reduce((sum, d) => sum + parseFloat(d.weight_kg || 0), 0);
  const totalVolume = shipments.reduce((sum, d) => sum + parseFloat(d.volume_cbm || 0), 0);
  return { totalShipments: shipments.length, totalWeight, totalVolume };
}

export function getAverages(data: any[]) {
  const shipments = getUniqueShipments(data);
  const total = shipments.length;
  const avgWeight = total ? shipments.reduce((sum, d) => sum + parseFloat(d.weight_kg || 0), 0) / total : 0;
  const avgVolume = total ? shipments.reduce((sum, d) => sum + parseFloat(d.volume_cbm || 0), 0) / total : 0;
  return { avgWeight, avgVolume };
}

export function getVariance(data: any[], field: string) {
  const vals = getUniqueShipments(data).map(d => parseFloat(d[field] || 0));
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
  return { mean, variance, stddev: Math.sqrt(variance) };
}

export function getForwarderStats(data: any[]) {
  const forwarders = [
    "kuehne_nagel", "agl", "dhl_express", "dhl_global",
    "siginon", "bwosi", "scan_global_logistics", "frieght_in_time"
  ];
  return forwarders.map(fwd => {
    const quotes = data.map(d => parseFloat(d[fwd] || "0")).filter(q => q > 0);
    const total = quotes.reduce((a, b) => a + b, 0);
    const avg = quotes.length ? total / quotes.length : 0;
    return { name: fwd, total, avg, count: quotes.length };
  });
}

export function getArrivalDelays(data: any[]) {
  return getUniqueShipments(data).map(d => {
    const start = new Date(d.date_of_collection);
    const end = new Date(d.date_of_arrival_destination);
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return { ...d, delayDays: days };
  });
}

export function detectAnomalies(data: any[]) {
  const shipments = getUniqueShipments(data);
  const costStats = getVariance(shipments, "carrier+cost");
  const weightStats = getVariance(shipments, "weight_kg");
  const anomalies: any[] = [];

  shipments.forEach(shipment => {
    const cost = parseFloat(shipment["carrier+cost"] || 0);
    const weight = parseFloat(shipment.weight_kg || 0);
    const ratio = weight ? cost / weight : 0;
    const start = new Date(shipment.date_of_collection);
    const end = new Date(shipment.date_of_arrival_destination);
    const delay = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    // Example rules (expand as needed)
    if (ratio > 50) anomalies.push({
      ...shipment, rule: "High Cost/Weight Ratio", reason: `Cost/Weight = ${ratio.toFixed(2)}`, severity: "high", remediation: "Review carrier pricing"
    });
    if (cost > costStats.mean + 2 * costStats.stddev) anomalies.push({
      ...shipment, rule: "Cost Outlier", reason: `Cost $${cost} > 2σ above mean`, severity: "medium", remediation: "Negotiate with forwarder"
    });
    if (delay > 30) anomalies.push({
      ...shipment, rule: "Delayed Arrival", reason: `Transit time ${delay.toFixed(1)} days`, severity: "high", remediation: "Investigate route bottlenecks"
    });
    // Add more rules as needed...
  });

  return anomalies;
}
