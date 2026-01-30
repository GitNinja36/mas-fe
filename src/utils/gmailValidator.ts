/**
 * Validates Gmail addresses according to Gmail's rules
 * 
 * Gmail username rules:
 * - Length: 6-30 characters
 * - Allowed characters: letters (a-z, A-Z), numbers (0-9), dots (.), plus signs (+)
 * - Cannot start or end with a dot
 * - Cannot have consecutive dots
 * - Domain must be exactly @gmail.com (case-insensitive)
 * - No spaces allowed
 * 
 * @param email - Email address to validate
 * @returns true if email is a valid Gmail address, false otherwise
 */
export function isValidGmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  
  // Must end with @gmail.com
  if (!normalized.endsWith('@gmail.com')) {
    return false;
  }
  
  // Extract username part (before @)
  const username = normalized.split('@')[0];
  
  // Username length: 6-30 characters (Gmail's actual limit)
  if (username.length < 6 || username.length > 30) {
    return false;
  }
  
  // Cannot start or end with dot
  if (username.startsWith('.') || username.endsWith('.')) {
    return false;
  }
  
  // Cannot have consecutive dots
  if (username.includes('..')) {
    return false;
  }
  
  // Only allow letters, numbers, dots, and plus signs
  const validPattern = /^[a-z0-9.+]+$/;
  if (!validPattern.test(username)) {
    return false;
  }
  
  return true;
}
