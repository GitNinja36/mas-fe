// Environment-aware logger that only logs in development
// Prevents console pollution in production builds

const isDevelopment = import.meta.env.DEV;

/**
 * Environment-aware logger
 * - In development: logs to console normally
 * - In production: silent (no console output)
 */
export const logger = {
    /**
     * Log general information (development only)
     */
    log: (...args: any[]) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    /**
     * Log errors (development only)
     */
    error: (...args: any[]) => {
        if (isDevelopment) {
            console.error(...args);
        }
    },

    /**
     * Log warnings (development only)
     */
    warn: (...args: any[]) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    /**
     * Log informational messages (development only)
     */
    info: (...args: any[]) => {
        if (isDevelopment) {
            console.info(...args);
        }
    },

    /**
     * Log debug information (development only)
     */
    debug: (...args: any[]) => {
        if (isDevelopment) {
            console.debug(...args);
        }
    }
};

/**
 * Production-safe error reporting
 * Can be extended to integrate with error tracking services (Sentry, DataDog, etc.)
 */
export const reportError = (error: Error, context?: Record<string, any>) => {
    if (!isDevelopment) {
        // In production, this could send to an error tracking service
        // For now, we'll use console.error as a fallback
        console.error('Production error:', error.message, context);

        // TODO: Integrate with error tracking service
        // Example: Sentry.captureException(error, { extra: context });
    } else {
        console.error('Error:', error, context);
    }
};

/**
 * Report a warning that should be tracked but doesn't need immediate attention
 */
export const reportWarning = (message: string, context?: Record<string, any>) => {
    if (!isDevelopment) {
        // In production, this could send to a monitoring service
        console.warn('Production warning:', message, context);

        // TODO: Integrate with monitoring service
    } else {
        console.warn('Warning:', message, context);
    }
};
