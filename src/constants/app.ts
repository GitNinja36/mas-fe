// Application-wide constants

/**
 * Polling configuration for survey status checks
 */
export const POLLING_CONFIG = {
    /** Polling interval in milliseconds */
    INTERVAL_MS: 10000, // 10 seconds

    /** Maximum number of polling attempts before giving up */
    MAX_ATTEMPTS: 120, // 20 minutes total (120 * 10 seconds)

    /** Multiplier for exponential backoff */
    BACKOFF_MULTIPLIER: 1.5,

    /** Maximum polling interval when using exponential backoff */
    MAX_INTERVAL_MS: 60000 // 1 minute max
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION = {
    /** Default number of items per page */
    ITEMS_PER_PAGE: 9,

    /** Default page number */
    DEFAULT_PAGE: 1
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
    /** Request timeout in milliseconds */
    TIMEOUT_MS: 30000, // 30 seconds

    /** Number of retry attempts for failed requests */
    RETRY_ATTEMPTS: 3,

    /** Delay between retry attempts in milliseconds */
    RETRY_DELAY_MS: 1000 // 1 second
} as const;

/**
 * Local storage keys
 * Centralized to prevent typos and make refactoring easier
 */
export const STORAGE_KEYS = {
    /** Access token for authentication */
    ACCESS_TOKEN: 'access_token',

    /** Refresh token for renewing access tokens */
    REFRESH_TOKEN: 'refresh_token',

    /** User information */
    USER: 'user',

    /** Survey context data */
    SURVEY_CONTEXT: 'survey_context'
} as const;

/**
 * Route paths
 */
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verify-otp',
    DASHBOARD: '/dashboard',
    CREDITS: '/credits',
    SURVEY: '/survey',
    AGENT: '/agent',
    RESULTS: '/results'
} as const;

/**
 * Toast notification durations (milliseconds)
 */
export const TOAST_DURATION = {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
} as const;

/**
 * Survey status values
 */
export const SURVEY_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
} as const;

/**
 * Credit package IDs or amounts
 */
export const CREDITS = {
    MIN_BALANCE: 0,
    SURVEY_COST: 10 // Cost per survey in credits
} as const;
