import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface SignupFormProps {
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  signupError?: string | null;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onSwitchToLogin,
  signupError,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (validateForm()) {
      setIsLoading(true);
      try {
        await onSignup(name, email, password);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="flex flex-col items-center mb-4">
          <span className="text-gray-700 dark:text-gray-200 text-xl font-semibold tracking-wide select-none mb-2">
            Briefly<span className="text-teal-500 dark:text-teal-400">AI</span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={18} />}
            fullWidth
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            fullWidth
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            fullWidth
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            fullWidth
          />
          {/* Show all errors above the button, after submit */}
          {submitted && (errors.name || errors.email || errors.password || errors.confirmPassword) && (
            <div className="space-y-1">
              {errors.name && <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
              {errors.email && <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
              {errors.password && <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
              {errors.confirmPassword && <p className="text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
            </div>
          )}
          {signupError && (
            <p className="text-xs text-red-600 dark:text-red-400">{signupError}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account? </span>
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm; 