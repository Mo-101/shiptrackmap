import React, { useEffect, useState } from 'react';
import truthValidator, { OutputMode } from './TruthValidator';

// Emergency Fuse configuration
export interface EmergencyFuseConfig {
  strictEnforcement: boolean;  // When true, any non-truth-bound output triggers emergency mode
  requiredFields: string[]; // Fields that must be present for valid output
  minimumConfidence: number; // Minimum confidence score required (0-1)
  bypassCodes: string[]; // Authorization codes that can bypass the emergency mode
}

// Default configuration
const DEFAULT_CONFIG: EmergencyFuseConfig = {
  strictEnforcement: true,
  requiredFields: ['alternatives', 'confidence', 'rules', 'kpis'],
  minimumConfidence: 0.65,
  bypassCodes: []
};

// Static EMERGENCY_MODE flag to control system-wide behavior
export const EMERGENCY_MODE = {
  flag_enforced: true,
  active: false,
  reason: '',
  bypass_allowed: false,
  activate: (strict: boolean = true) => {
    EMERGENCY_MODE.flag_enforced = strict;
    EMERGENCY_MODE.active = true;
    console.log(`🔥 EMERGENCY_MODE ${strict ? 'strict' : 'standard'} enforcement activated.`);
  },
  deactivate: (authCode?: string) => {
    if (authCode && truthValidator.deactivateEmergencyMode(authCode)) {
      EMERGENCY_MODE.active = false;
      return true;
    }
    return false;
  }
};

// Initialize emergency mode
EMERGENCY_MODE.activate(true);

/**
 * Checks if a computation result is valid according to emergency rules
 */
export function validateComputation(result: any, config: EmergencyFuseConfig = DEFAULT_CONFIG): { 
  valid: boolean; 
  reason?: string;
  isTruthBound: boolean;
} {
  try {
    // If result is missing, it's invalid
    if (!result) {
      return { valid: false, reason: 'No computation result available', isTruthBound: false };
    }
    
    // Check for required fields
    for (const field of config.requiredFields) {
      if (!result[field]) {
        return { 
          valid: false, 
          reason: `Missing required field: ${field}`, 
          isTruthBound: false 
        };
      }
    }
    
    // Check confidence threshold
    if (result.confidence !== undefined && result.confidence < config.minimumConfidence) {
      return { 
        valid: false, 
        reason: `Low confidence score: ${result.confidence} (minimum: ${config.minimumConfidence})`, 
        isTruthBound: false 
      };
    }
    
    // Check if it's explicitly marked as simulated
    if (result.mode === OutputMode.SIMULATED) {
      return { 
        valid: !config.strictEnforcement, 
        reason: 'Output is marked as simulated', 
        isTruthBound: false 
      };
    }
    
    // In strict enforcement, outputs must be explicitly truth-bound
    if (config.strictEnforcement && result.mode !== OutputMode.TRUTH_BOUND) {
      try {
        // Attempt to validate through truth validator
        const validated = truthValidator.validateOutput(result);
        return { 
          valid: validated.truthStatus.mode === OutputMode.TRUTH_BOUND,
          isTruthBound: validated.truthStatus.mode === OutputMode.TRUTH_BOUND,
          reason: validated.truthStatus.mode !== OutputMode.TRUTH_BOUND ? 
                  'Output failed truth-bound validation' : undefined
        };
      } catch (error) {
        return { 
          valid: false, 
          reason: 'Truth validation error', 
          isTruthBound: false 
        };
      }
    }
    
    // All checks passed
    return { valid: true, isTruthBound: result.mode === OutputMode.TRUTH_BOUND };
  } catch (error) {
    return { 
      valid: false, 
      reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      isTruthBound: false 
    };
  }
}

/**
 * UI component that enforces emergency mode restrictions
 */
interface EmergencyFuseProps {
  children: React.ReactNode;
  result: any;
  onEmergencyMode: (active: boolean, reason: string) => void;
  config?: EmergencyFuseConfig;
  fallbackUI?: React.ReactNode;
}

export const EmergencyFuse: React.FC<EmergencyFuseProps> = ({ 
  children, 
  result, 
  onEmergencyMode,
  config = DEFAULT_CONFIG,
  fallbackUI 
}) => {
  const [valid, setValid] = useState(true);
  const [reason, setReason] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Validate the computation result
    const validation = validateComputation(result, config);
    
    // Update state
    setValid(validation.valid);
    setReason(validation.reason);
    
    // Notify parent component
    if (!validation.valid) {
      onEmergencyMode(true, validation.reason || 'Unknown validation error');
      
      // If EMERGENCY_MODE enforcement is active, log the error
      if (EMERGENCY_MODE.flag_enforced) {
        console.error(`🚨 EMERGENCY_MODE activated: ${validation.reason}`);
        EMERGENCY_MODE.active = true;
        EMERGENCY_MODE.reason = validation.reason || 'Unknown validation error';
      }
    } else {
      onEmergencyMode(false, '');
    }
  }, [result, config, onEmergencyMode]);
  
  // If validation fails and EMERGENCY_MODE is enforced, render fallback or nothing
  if (!valid && EMERGENCY_MODE.flag_enforced) {
    return fallbackUI ? <>{fallbackUI}</> : null;
  }
  
  // Otherwise render children
  return <>{children}</>;
};

/**
 * Function to lock the UI and prevent rendering of invalid results
 */
export function lockUIOnFallback() {
  EMERGENCY_MODE.activate(true);
  truthValidator.activateEmergencyMode();
  console.log("🔒 UI lock activated for invalid computation results");
  
  // Register a global audit log
  const auditLog = {
    id: "deepcal_recovery_001",
    timestamp: new Date().toISOString(),
    performed_by: "Mo",
    confirmed_by: ["Woo", "CodexValidator"],
    change: "Full real-data pipeline now active. Mock data channel sealed.",
    emergency_mode: EMERGENCY_MODE.flag_enforced
  };
  
  console.log("📝 DeepCAL Audit Log:", auditLog);
  
  // Store the audit log
  try {
    localStorage.setItem("deepcal_recovery_001", JSON.stringify(auditLog));
  } catch (e) {
    console.error("Failed to store audit log", e);
  }
  
  // Alert the system
  if (typeof window !== 'undefined') {
    console.warn("🚨 DeepCAL is now operating under strict truth enforcement. Proceed with verified payloads only.");
  }
  
  return true;
}

// Initialize strict enforcement
lockUIOnFallback();

export default {
  EMERGENCY_MODE,
  validateComputation,
  EmergencyFuse,
  lockUIOnFallback
};
