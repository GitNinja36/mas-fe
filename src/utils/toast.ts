import { toast } from 'react-toastify'

/**
 * Shows a database connection error toast
 */
export function showDatabaseError(error: Error | string) {
  const message = typeof error === 'string' ? error : error.message
  
  // Check if it's a database-related error
  const isDatabaseError = 
    message.includes("Can't reach database") ||
    message.includes('database server') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ETIMEDOUT') ||
    message.includes('Connection timeout') ||
    message.includes('Connection closed') ||
    message.includes('PrismaClientInitializationError')
  
  if (isDatabaseError) {
    toast.error(
      'Database connection issue. The system is retrying automatically. Please wait...',
      {
        autoClose: 7000,
        position: 'top-right',
      }
    )
  } else {
    toast.error(message, {
      autoClose: 5000,
      position: 'top-right',
    })
  }
}

/**
 * Shows a success toast
 */
export function showSuccess(message: string) {
  toast.success(message, {
    autoClose: 3000,
    position: 'top-right',
  })
}

/**
 * Shows a warning toast
 */
export function showWarning(message: string) {
  toast.warning(message, {
    autoClose: 4000,
    position: 'top-right',
  })
}

/**
 * Shows an info toast
 */
export function showInfo(message: string) {
  toast.info(message, {
    autoClose: 4000,
    position: 'top-right',
  })
}
