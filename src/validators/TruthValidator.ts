/**
 * DeepCAL Truth Validator
 * 
 * Enforces the Truth-Bound covenant on all DeepCAL outputs.
 * Every result must explicitly declare its mode (truth-bound/simulated).
 * Prevents unauthorized simulation outputs when in strict mode.
 */

export enum OutputMode {
  TRUTH_BOUND = 'truth-bound',
  SIMULATED = 'simulated'
}

export interface TruthBoundStatus {
  mode: OutputMode;
  warning?: string;
  algorithmFingerprint: string;
  timestamp: string;
  verificationHash?: string;
}

export interface ValidatedOutput<T> {
  data: T;
  truthStatus: TruthBoundStatus;
}

// Configuration for the Truth Validator
export interface TruthValidatorConfig {
  strictMode: boolean;  // When true, simulated outputs will throw errors
  emergencyMode: boolean; // When true, additional validation steps are enforced
  allowedAlgorithms: string[]; // List of allowed algorithm fingerprints
}

class TruthValidator {
  private config: TruthValidatorConfig = {
    strictMode: true, // Default to strict mode
    emergencyMode: true, // Default to emergency mode
    allowedAlgorithms: ['deepcal-ng-ahp-topsis'] // Default allowed algorithms
  };

  constructor(config?: Partial<TruthValidatorConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Validates and labels an output with its truth-bound status
   */
  validateOutput<T extends Record<string, any>>(output: T, forceTruthBound = false): ValidatedOutput<T> {
    const isTruthBound = this.validateTruthBoundStatus(output);
    
    // Generate verification hash for auditing
    const verificationHash = this.generateVerificationHash(output);
    
    // Create the truth status object
    const truthStatus: TruthBoundStatus = {
      mode: forceTruthBound || isTruthBound ? OutputMode.TRUTH_BOUND : OutputMode.SIMULATED,
      algorithmFingerprint: output.algorithmFingerprint || 'unknown',
      timestamp: output.timestamp || new Date().toISOString(),
      verificationHash
    };
    
    // Add warning for simulated data
    if (truthStatus.mode === OutputMode.SIMULATED) {
      truthStatus.warning = "This output is not generated from the DeepCAL engine";
    }
    
    // In strict mode, throw error for simulated outputs
    if (this.config.strictMode && this.config.emergencyMode && truthStatus.mode === OutputMode.SIMULATED) {
      throw new Error("🚨 Emergency mode active: Computation must be verified");
    }
    
    return {
      data: { ...output, mode: truthStatus.mode },
      truthStatus
    };
  }
  
  /**
   * Check if an output meets truth-bound criteria
   */
  private validateTruthBoundStatus(output: Record<string, any>): boolean {
    // An output is truth-bound if:
    
    // 1. It has a valid algorithm fingerprint
    const hasValidFingerprint = output.algorithmFingerprint && 
      (output.algorithmFingerprint.startsWith('deepcal-') || 
       this.config.allowedAlgorithms.includes(output.algorithmFingerprint));
    
    // 2. It has non-default/non-mock results
    const hasRealResults = output.confidence !== undefined && 
                           output.confidence > 0 &&
                           output.alternatives && 
                           output.alternatives.length > 0;
    
    // 3. It is explicitly marked as truth-bound
    const isExplicitlyTruthBound = output.mode === OutputMode.TRUTH_BOUND;
    
    return (hasValidFingerprint && hasRealResults) || isExplicitlyTruthBound;
  }
  
  /**
   * Creates a verification hash for audit purposes
   */
  private generateVerificationHash(data: any): string {
    // In a real implementation, this would use a cryptographic hash
    // Here we create a simplified version for demonstration
    const timestamp = Date.now().toString();
    const stringified = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < stringified.length; i++) {
      const char = stringified.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    
    return `${Math.abs(hash).toString(16)}-${timestamp.slice(-6)}`;
  }
  
  /**
   * Sets the validator configuration
   */
  setConfig(config: Partial<TruthValidatorConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Activates emergency mode with strict validation
   */
  activateEmergencyMode(): void {
    this.config.emergencyMode = true;
    this.config.strictMode = true;
    console.log("🔥 EMERGENCY_MODE strict enforcement activated");
  }
  
  /**
   * Deactivates emergency mode (requires authorization)
   */
  deactivateEmergencyMode(authorizationCode: string): boolean {
    // In a real implementation, this would verify the authorization code
    if (authorizationCode === "DEEPCAL-OVERRIDE-AUTHORIZATION") {
      this.config.emergencyMode = false;
      return true;
    }
    return false;
  }
}

// Create and export a singleton instance
const truthValidator = new TruthValidator();

export default truthValidator;
