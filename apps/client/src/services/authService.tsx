import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import type {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  IUserResponse,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IChangePasswordRequest,
} from '@noted/types';

const customId = 'custom-id-for-toast';

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Always send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for automatic token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: Error | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest!))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/api/users/refresh');
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest!);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        isRefreshing = false;
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const validateEmail = (email: string): boolean => {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData: IRegisterRequest): Promise<IAuthResponse | undefined> => {
  try {
    const response = await api.post<IAuthResponse>('/api/users/register', userData);

    if (response.status === 201) {
      toast.success('User Registered successfully', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Registration failed';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Login User
export const loginUser = async (userData: ILoginRequest): Promise<IAuthResponse | undefined> => {
  try {
    const response = await api.post<IAuthResponse>('/api/users/login', userData);

    if (response.status === 200) {
      toast.success('Login successfully', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Login failed';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Logout User
export const logoutUser = async (): Promise<{ message: string } | undefined> => {
  try {
    const response = await api.get<{ message: string }>('/api/users/logout');

    if (response.status === 200) {
      toast.success('Logout Successfully', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Logout failed';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Forgot Password
export const forgotPassword = async (userData: IForgotPasswordRequest): Promise<string | undefined> => {
  try {
    const response = await api.post<{ message: string }>('/api/users/forgotpassword', userData);

    toast.success(response.data.message, {
      position: 'top-right',
      autoClose: 1100,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

    return response.data.message;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Failed to send reset email';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Reset Password
export const resetPassword = async (
  userData: IResetPasswordRequest,
  resetToken: string
): Promise<{ message: string } | undefined> => {
  try {
    const response = await api.put<{ message: string }>(
      `/api/users/resetpassword/${resetToken}`,
      userData
    );

    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Password reset failed';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Get Login Status
export const getLoginStatus = async (): Promise<boolean> => {
  try {
    const response = await api.get<boolean>('/api/users/loggedin');
    return response.data;
  } catch (error) {
    return false;
  }
};

// Get User Profile
export const getUser = async (): Promise<IUserResponse | undefined> => {
  try {
    const response = await api.get<IUserResponse>('/api/users/getuser');
    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Failed to get user';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Update Profile
export const updateUser = async (formData: Partial<IUserResponse>): Promise<IUserResponse | undefined> => {
  try {
    const response = await api.patch<IUserResponse>('/api/users/updateuser', formData);
    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Failed to update user';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};

// Change Password
export const changePassword = async (formData: IChangePasswordRequest): Promise<string | undefined> => {
  try {
    const response = await api.patch<string>('/api/users/changepassword', formData);
    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      (error as Error).message ||
      'Failed to change password';
    toast.error(message, {
      toastId: customId,
    });
    return undefined;
  }
};
