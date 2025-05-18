// Explanation Builder Service - starter
export function buildExplanationTrace(ranked: any, rulesHit: any, criteriaWeights: any): any {
  // TODO: Implement explanation generation
}

// (Legacy) For compatibility
export function generateExplanations(rulesHit: any, weights: any, ranked: any): any {
  return buildExplanationTrace(ranked, rulesHit, weights);
}
