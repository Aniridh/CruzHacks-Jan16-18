/**
 * Environment Variable Validation Utility
 * 
 * This file validates environment variables at runtime and provides
 * clear error messages for missing or invalid configurations.
 * 
 * Security Best Practices:
 * - Never log actual API key values
 * - Use NEXT_PUBLIC_ prefix only for client-safe values
 * - Validate on both client and server as needed
 */

// ============================================
// SERVER-SIDE VALIDATION (API Routes Only)
// ============================================

export interface ServerEnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validates server-side environment variables
 * Use this in API routes only
 */
export function validateServerEnv(): ServerEnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // OpenAI API Key (optional - falls back to rule-based)
  if (!process.env.OPENAI_API_KEY) {
    warnings.push('OPENAI_API_KEY not configured - using rule-based analysis fallback');
  } else if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    warnings.push('OPENAI_API_KEY may be invalid (should start with sk-)');
  }

  // Vapi Webhook Secret (optional - for production security)
  if (!process.env.VAPI_WEBHOOK_SECRET) {
    warnings.push('VAPI_WEBHOOK_SECRET not configured - webhook validation disabled');
  }

  // MongoDB URI (optional - for incident logging)
  if (!process.env.MONGODB_URI) {
    warnings.push('MONGODB_URI not configured - incident logging disabled');
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Gets OpenAI API key safely
 * Returns null if not configured
 */
export function getOpenAIKey(): string | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  return key;
}

/**
 * Gets Vapi webhook secret safely
 * Returns null if not configured
 */
export function getVapiWebhookSecret(): string | null {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret || secret.trim() === '') {
    return null;
  }
  return secret;
}

/**
 * Gets MongoDB URI safely
 * Returns null if not configured
 */
export function getMongoURI(): string | null {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    return null;
  }
  return uri;
}

// ============================================
// CLIENT-SIDE VALIDATION (Browser Only)
// ============================================

export interface ClientEnvValidationResult {
  vapiAvailable: boolean;
  vapiAssistantAvailable: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates client-side environment variables
 * Use this in React components
 */
export function validateClientEnv(): ClientEnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Vapi Public Key (optional - demo mode works without it)
  const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  let vapiAvailable = false;

  if (!vapiKey || vapiKey.trim() === '') {
    warnings.push('Voice input unavailable - NEXT_PUBLIC_VAPI_PUBLIC_KEY not configured');
  } else {
    // Validate key format (UUID or pk_ format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vapiKey);
    const isPkFormat = vapiKey.startsWith('pk_');

    if (!isUUID && !isPkFormat) {
      errors.push('NEXT_PUBLIC_VAPI_PUBLIC_KEY has invalid format (expected UUID or pk_ format)');
    } else {
      vapiAvailable = true;
    }
  }

  // Vapi Assistant ID (optional - can use inline config)
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const vapiAssistantAvailable = !!(assistantId && assistantId.trim() !== '');

  if (!vapiAssistantAvailable) {
    warnings.push('NEXT_PUBLIC_VAPI_ASSISTANT_ID not configured - using inline assistant config');
  }

  return {
    vapiAvailable,
    vapiAssistantAvailable,
    errors,
    warnings,
  };
}

/**
 * Gets Vapi public key safely
 * Returns null if not configured or invalid
 */
export function getVapiPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  
  if (!key || key.trim() === '') {
    return null;
  }

  // Validate format
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
  const isPkFormat = key.startsWith('pk_');

  if (!isUUID && !isPkFormat) {
    console.error('[ENV] Invalid Vapi public key format');
    return null;
  }

  return key;
}

/**
 * Gets Vapi assistant ID safely
 * Returns null if not configured
 */
export function getVapiAssistantId(): string | null {
  const id = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  if (!id || id.trim() === '') {
    return null;
  }
  return id;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Logs validation results (production-safe)
 * Never logs actual key values
 */
export function logEnvStatus(isServer: boolean = false): void {
  if (isServer) {
    const result = validateServerEnv();
    
    if (result.missing.length > 0) {
      console.error('[ENV] Missing required environment variables:', result.missing);
    }
    
    if (result.warnings.length > 0) {
      console.warn('[ENV] Environment warnings:', result.warnings);
    }
    
    if (result.valid && result.warnings.length === 0) {
      console.log('[ENV] ✅ All server environment variables configured');
    }
  } else {
    const result = validateClientEnv();
    
    if (result.errors.length > 0) {
      console.error('[ENV] Client environment errors:', result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn('[ENV] Client environment warnings:', result.warnings);
    }
    
    console.log('[ENV] Vapi available:', result.vapiAvailable);
    console.log('[ENV] Vapi assistant configured:', result.vapiAssistantAvailable);
  }
}

/**
 * Creates user-friendly error message for missing configuration
 */
export function getMissingConfigMessage(service: 'openai' | 'vapi' | 'mongodb'): string {
  const messages = {
    openai: 'OpenAI API key not configured. The system will use rule-based analysis as a fallback. For better results, add OPENAI_API_KEY to your environment variables.',
    vapi: 'Vapi AI not configured. Voice input is unavailable. You can still use Demo Mode with pre-loaded scenarios. To enable voice input, add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your environment variables.',
    mongodb: 'MongoDB not configured. Incident logging is unavailable. The system will work normally without persistent storage. To enable logging, add MONGODB_URI to your environment variables.',
  };
  
  return messages[service];
}
