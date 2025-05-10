import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  onSwitchToSignup: () => void;
  onGoogleLogin: () => Promise<void>;
  loginError?: string | null;
  setLoginError?: (msg: string | null) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSwitchToSignup,
  onGoogleLogin,
  loginError,
  setLoginError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [submitted, setSubmitted] = useState(false);

  // Clear login error when user starts typing
  useEffect(() => {
    if (setLoginError) setLoginError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (touched.email && email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    // Only clear password error if not submitted or password is valid
    if (touched.password && (password.length >= 6 || !submitted)) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [email, password, touched, submitted]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return undefined;
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);
    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setSubmitted(true);
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        
        await onLogin(email, password, rememberMe);
      } catch {
        // Error handling is done in the parent component
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const emailError = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: emailError }));
    } else {
      const passwordError = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="flex flex-col items-center mb-4">
          <span className="text-gray-700 dark:text-gray-200 text-xl font-semibold tracking-wide select-none mb-2">
            Briefly<span className="text-teal-500 dark:text-teal-400">AI</span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Log in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            leftIcon={<Mail size={18} />}
            fullWidth
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            leftIcon={<Lock size={18} />}
            rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            fullWidth
          />
          {loginError && (
            <p className="text-xs text-red-600 dark:text-red-400">{loginError}</p>
          )}
          {errors.password && submitted && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
          )}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700 dark:text-gray-300 select-none">
              Remember me
            </label>
          </div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Log in
          </Button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        <Button
          type="button"
          variant="outline"
          fullWidth
          leftIcon={
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17_40)">
                <path d="M47.5 24.5C47.5 22.1667 47.2833 20.1667 46.8333 18.3333H24V29.5H37.5C37.1667 31.5 35.8333 34.3333 33 36.1667L32.9667 36.3667L40.1667 41.8333L40.6667 41.8833C45.1667 37.8333 47.5 32.6667 47.5 24.5Z" fill="#4285F4"/>
                <path d="M24 48C30.5 48 35.8333 45.8333 40.6667 41.8833L33 36.1667C30.8333 37.6667 28 38.6667 24 38.6667C17.6667 38.6667 12.1667 34.5 10.3333 29.1667L10.1333 29.1833L2.66667 34.8333L2.56667 35C7.33333 43.1667 15.1667 48 24 48Z" fill="#34A853"/>
                <path d="M10.3333 29.1667C9.83333 27.6667 9.5 26 9.5 24C9.5 22 9.83333 20.3333 10.3333 18.8333V18.8167L2.76667 13.0667L2.56667 13C0.833333 16.3333 0 20 0 24C0 28 0.833333 31.6667 2.56667 35L10.3333 29.1667Z" fill="#FBBC05"/>
                <path d="M24 9.33333C28.1667 9.33333 31 11.1667 32.6667 12.6667L40.8333 5.16667C35.8333 0.833333 30.5 0 24 0C15.1667 0 7.33333 4.83333 2.56667 13L10.3333 18.8333C12.1667 13.5 17.6667 9.33333 24 9.33333Z" fill="#EA4335"/>
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          }
          onClick={onGoogleLogin}
          className="mb-2"
        >
          Continue with Google
        </Button>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Don&apos;t have an account? </span>
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            onClick={onSwitchToSignup}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 