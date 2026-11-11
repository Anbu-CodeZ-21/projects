import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUserFromApi,
} from '../api/authApi';
import {
  getStoredToken,
  setStoredToken,
} from '../api/apiClient';
import {
  fetchNotifications,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
} from '../api/notificationsApi';
import {
  updateFreelancerProfileApi,
  updateClientProfileApi,
} from '../api/freelancersApi';
import {
  getCurrentUser,
  setCurrentUser,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Load active session from API on app mount
  useEffect(() => {
    async function initSession() {
      const token = getStoredToken();
      if (token) {
        try {
          const apiUser = await getCurrentUserFromApi();
          if (apiUser) {
            setUser(apiUser);
            setCurrentUser(apiUser);
            loadUserNotifications();
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Token session expired or backend unreachable, checking local session:', err);
          setStoredToken(null);
        }
      }

      // Check cached session
      const stored = getCurrentUser();
      if (stored) {
        setUser(stored);
      }
      setLoading(false);
    }

    initSession();
  }, []);

  const loadUserNotifications = async () => {
    try {
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch {
      // Ignore if user not logged in
    }
  };

  const login = async (email, password, role) => {
    try {
      const { user: loggedInUser } = await loginUser(email, password);

      // Validate role consistency if role provided
      if (role && loggedInUser.role !== role.toLowerCase()) {
        const expectedRole = loggedInUser.role === 'client' ? 'Client' : 'Freelancer';
        return {
          success: false,
          message: `This account is registered as a ${expectedRole}. Please switch your role toggle above.`,
        };
      }

      setUser(loggedInUser);
      setCurrentUser(loggedInUser);
      loadUserNotifications();
      return { success: true, user: loggedInUser };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Invalid email or password. Please verify your credentials.',
      };
    }
  };

  const registerFreelancer = async (data) => {
    try {
      const payload = {
        fullName: data.name?.trim(),
        email: data.email?.trim(),
        password: data.password,
        role: 'Freelancer',
        professionalTitle: data.title?.trim(),
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
        hourlyRate: Number(data.hourlyRate) || 800,
        location: data.location || 'Bengaluru, Karnataka',
      };

      const { user: registeredUser } = await registerUser(payload);
      setUser(registeredUser);
      setCurrentUser(registeredUser);
      loadUserNotifications();
      return { success: true, user: registeredUser };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Registration failed. Please check your details.',
      };
    }
  };

  const registerClient = async (data) => {
    try {
      const payload = {
        fullName: data.name?.trim(),
        email: data.email?.trim(),
        password: data.password,
        role: 'Client',
        companyName: data.companyName?.trim(),
        industry: data.industry || 'Technology & Software',
        location: data.location || 'Mumbai, Maharashtra',
      };

      const { user: registeredUser } = await registerUser(payload);
      setUser(registeredUser);
      setCurrentUser(registeredUser);
      loadUserNotifications();
      return { success: true, user: registeredUser };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Registration failed. Please check your details.',
      };
    }
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
    setCurrentUser(null);
    setNotifications([]);
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return;

    try {
      if (user.role === 'freelancer') {
        const res = await updateFreelancerProfileApi({
          fullName: updatedFields.name || updatedFields.fullName,
          professionalTitle: updatedFields.title || updatedFields.professionalTitle,
          bio: updatedFields.bio,
          skills: Array.isArray(updatedFields.skills) ? updatedFields.skills.join(', ') : updatedFields.skills,
          hourlyRate: updatedFields.hourlyRate ? Number(updatedFields.hourlyRate) : undefined,
          location: updatedFields.location,
          portfolioUrl: updatedFields.portfolioUrl,
          availability: updatedFields.availability,
        });
        const updated = { ...user, ...res };
        setUser(updated);
        setCurrentUser(updated);
      } else {
        await updateClientProfileApi({
          fullName: updatedFields.name || updatedFields.fullName,
          companyName: updatedFields.companyName,
          companyDescription: updatedFields.bio || updatedFields.companyDescription,
          industry: updatedFields.industry,
          location: updatedFields.location,
          website: updatedFields.website,
        });
        const updated = { ...user, ...updatedFields };
        setUser(updated);
        setCurrentUser(updated);
      }
    } catch (err) {
      console.error('Failed to update profile on backend:', err);
      // Optimistic local update
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  const quickLogin = async (role) => {
    const email = role === 'freelancer' ? 'freelancer@skillbridge.in' : 'client@skillbridge.in';
    const password = 'password123';
    return await login(email, password, role);
  };

  const markNotificationAsRead = async (id) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllNotificationsAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        registerFreelancer,
        registerClient,
        logout,
        updateProfile,
        quickLogin,
        notifications,
        unreadCount,
        refreshNotifications: loadUserNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
