import { Email } from './email.vo';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create valid email', () => {
      // Arrange & Act
      const email = new Email('user@upt.pe');

      // Assert
      expect(email.value).toBe('user@upt.pe');
    });

    it('should normalize email to lowercase', () => {
      // Arrange & Act
      const email = new Email('USER@UPT.PE');

      // Assert
      expect(email.value).toBe('user@upt.pe');
    });

    it('should create email without extra spaces', () => {
      // Arrange & Act
      const email = new Email('user@upt.pe');

      // Assert
      expect(email.value).toBe('user@upt.pe');
    });

    it('should throw error for invalid email format', () => {
      // Arrange & Act & Assert
      expect(() => new Email('invalid-email')).toThrow('Formato de email inválido');
      expect(() => new Email('user@')).toThrow('Formato de email inválido');
      expect(() => new Email('@domain.com')).toThrow('Formato de email inválido');
      expect(() => new Email('')).toThrow('Formato de email inválido');
    });
  });

  describe('isUptEmail', () => {
    it('should return true for UPT emails', () => {
      // Arrange
      const uptEmail = new Email('student@upt.pe');
      const uptEduEmail = new Email('teacher@upt.edu.pe');

      // Act & Assert
      expect(uptEmail.isUptEmail()).toBe(true);
      expect(uptEduEmail.isUptEmail()).toBe(true);
    });

    it('should return false for non-UPT emails', () => {
      // Arrange
      const gmailEmail = new Email('user@gmail.com');
      const hotmailEmail = new Email('user@hotmail.com');

      // Act & Assert
      expect(gmailEmail.isUptEmail()).toBe(false);
      expect(hotmailEmail.isUptEmail()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for same emails', () => {
      // Arrange
      const email1 = new Email('user@upt.pe');
      const email2 = new Email('user@upt.pe');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      // Arrange
      const email1 = new Email('user1@upt.pe');
      const email2 = new Email('user2@upt.pe');

      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });

    it('should handle case insensitive comparison', () => {
      // Arrange
      const email1 = new Email('USER@UPT.PE');
      const email2 = new Email('user@upt.pe');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return email value as string', () => {
      // Arrange
      const email = new Email('user@upt.pe');

      // Act & Assert
      expect(email.toString()).toBe('user@upt.pe');
    });
  });
});