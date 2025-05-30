import {
  validateEmail,
  validatePassword,
  validateUrl,
  validateRequired,
  sanitizeInput,
  validateUserRegistration,
} from '../validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBeNull()
      expect(validateEmail('user.name+tag@domain.co.uk')).toBeNull()
      expect(validateEmail('user123@test-domain.com')).toBeNull()
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).not.toBeNull()
      expect(validateEmail('test@')).not.toBeNull()
      expect(validateEmail('@domain.com')).not.toBeNull()
      expect(validateEmail('test.domain.com')).not.toBeNull()
      expect(validateEmail('')).not.toBeNull()
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('password123')).toBeNull()
      expect(validatePassword('mySecurePassword')).toBeNull()
      expect(validatePassword('123456')).toBeNull() // Meets minimum length
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('12345')).not.toBeNull() // Too short
      expect(validatePassword('')).not.toBeNull() // Empty
      expect(validatePassword('a'.repeat(129))).not.toBeNull() // Too long
    })
  })

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBeNull()
      expect(validateUrl('http://test.org')).toBeNull()
      expect(validateUrl('https://sub.domain.com/path?query=1')).toBeNull()
    })

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).not.toBeNull()
      expect(validateUrl('ftp://example.com')).not.toBeNull()
      expect(validateUrl('')).not.toBeNull()
      expect(validateUrl('example.com')).not.toBeNull() // Missing protocol
    })
  })

  describe('validateRequired', () => {
    it('should validate non-empty values', () => {
      expect(validateRequired('test', 'field')).toBeNull()
      expect(validateRequired('0', 'field')).toBeNull()
      expect(validateRequired(123, 'field')).toBeNull()
      // Note: false is considered empty by the validation function
    })

    it('should reject empty values', () => {
      expect(validateRequired('', 'field')).not.toBeNull()
      expect(validateRequired('   ', 'field')).not.toBeNull() // Whitespace only
      expect(validateRequired(null, 'field')).not.toBeNull()
      expect(validateRequired(undefined, 'field')).not.toBeNull()
    })
  })

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
      // Note: The sanitizeInput function only removes < and > characters
      expect(sanitizeInput('Hello & World')).toBe('Hello & World')
      expect(sanitizeInput('Test "quotes"')).toBe('Test "quotes"')
    })

    it('should preserve safe characters', () => {
      expect(sanitizeInput('Hello World 123')).toBe('Hello World 123')
      expect(sanitizeInput('user@example.com')).toBe('user@example.com')
      expect(sanitizeInput('Test-string_with.dots')).toBe('Test-string_with.dots')
    })

    it('should handle empty inputs', () => {
      expect(sanitizeInput('')).toBe('')
    })
  })

  describe('validateUserRegistration', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    }

    it('should validate correct registration data', () => {
      const result = validateUserRegistration(validData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject missing required fields', () => {
      const result = validateUserRegistration({
        name: '',
        email: '',
        password: '',
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
      expect(result.errors.some(e => e.field === 'name')).toBe(true)
      expect(result.errors.some(e => e.field === 'email')).toBe(true)
      expect(result.errors.some(e => e.field === 'password')).toBe(true)
    })

    it('should reject invalid email format', () => {
      const result = validateUserRegistration({
        ...validData,
        email: 'invalid-email',
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.field === 'email')).toBe(true)
    })

    it('should reject weak passwords', () => {
      const result = validateUserRegistration({
        ...validData,
        password: '123',
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.field === 'password')).toBe(true)
    })

    it('should reject names that are too long', () => {
      const result = validateUserRegistration({
        ...validData,
        name: 'a'.repeat(51), // Exceeds max length
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.field === 'name')).toBe(true)
    })
  })
}) 