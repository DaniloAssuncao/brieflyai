import { Document } from 'mongoose';

// Base User interface matching the database schema
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// User document interface for Mongoose
export interface IUserDocument extends IUser, Document {
  _id: string;
}

// Public user interface (without sensitive data)
export interface IPublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// User registration form data
export interface IUserRegistrationData {
  name: string;
  email: string;
  password: string;
}

// User login form data
export interface IUserLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// User profile update data
export interface IUserUpdateData {
  name?: string;
  email?: string;
}

// User password change data
export interface IUserPasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// User session data (extends NextAuth User)
export interface IUserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
} 