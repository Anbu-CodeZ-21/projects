import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  getFreelancers,
  saveFreelancer,
  getClients,
  saveClient,
  getNotifications,
  initStorage,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Initialize storage and load session
  useEffect(() => {
    initStorage();
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    refreshNotifications(storedUser?.id);
    setLoading(false);
  }, []);

  const refreshNotifications = (userId) => {
    const allNotifs = getNotifications();
    if (userId) {
      const userNotifs = allNotifs.filter((n) => n.userId === userId);
      setNotifications(userNotifs);
    } else {
      setNotifications([]);
    }
  };

  const login = async (email, password, role) => {
    const trimmedEmail = email.trim().toLowerCase();
    const freelancers = getFreelancers();
    const clients = getClients();

    let matchedUser = null;
    if (role === 'freelancer') {
      matchedUser = freelancers.find(
        (f) => f.email.toLowerCase() === trimmedEmail && f.password === password
      );
    } else if (role === 'client') {
      matchedUser = clients.find(
        (c) => c.email.toLowerCase() === trimmedEmail && c.password === password
      );
    }

    if (!matchedUser) {
      // Also check if account exists in the other role
      const oppositeList = role === 'freelancer' ? clients : freelancers;
      const existsInOther = oppositeList.some((u) => u.email.toLowerCase() === trimmedEmail);
      if (existsInOther) {
        return {
          success: false,
          message: `This account is registered as a ${role === 'freelancer' ? 'Client' : 'Freelancer'}. Please switch your role toggle above.`,
        };
      }
      return {
        success: false,
        message: 'Invalid email or password. Please verify your credentials or use the demo login.',
      };
    }

    // Success
    const sessionUser = { ...matchedUser };
    delete sessionUser.password; // Do not keep password in active session state
    setUser(sessionUser);
    setCurrentUser(sessionUser);
    refreshNotifications(sessionUser.id);
    return { success: true, user: sessionUser };
  };

  const registerFreelancer = async (data) => {
    const freelancers = getFreelancers();
    const existing = freelancers.find((f) => f.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists as a freelancer.' };
    }

    const newFreelancer = {
      id: `free-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: 'freelancer',
      title: data.title.trim(),
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      bio: data.bio || 'Passionate professional ready to deliver top-notch project work.',
      hourlyRate: Number(data.hourlyRate) || 1000,
      rating: 5.0,
      reviewsCount: 0,
      skills: Array.isArray(data.skills)
        ? data.skills
        : data.skills.split(',').map((s) => s.trim()).filter(Boolean),
      experienceYears: Number(data.experienceYears) || 1,
      location: data.location || 'India',
      completedProjectsCount: 0,
      totalEarned: 0,
      memberSince: new Date().toISOString().split('T')[0],
      availability: data.availability || 'Available full-time',
      profileCompletion: 80,
      portfolio: [],
    };

    saveFreelancer(newFreelancer);
    const sessionUser = { ...newFreelancer };
    delete sessionUser.password;
    setUser(sessionUser);
    setCurrentUser(sessionUser);
    refreshNotifications(sessionUser.id);
    return { success: true, user: sessionUser };
  };

  const registerClient = async (data) => {
    const clients = getClients();
    const existing = clients.find((c) => c.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists as a client.' };
    }

    const newClient = {
      id: `client-${Date.now()}`,
      name: data.name.trim(),
      companyName: data.companyName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: 'client',
      avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.companyName)}`,
      bio: data.bio || 'Hiring top tier freelancers to build impactful digital solutions.',
      industry: data.industry || 'Technology & Software',
      location: data.location || 'India',
      website: data.website || '',
      rating: 5.0,
      projectsPostedCount: 0,
      totalSpent: 0,
      memberSince: new Date().toISOString().split('T')[0],
      verifiedPayment: true,
    };

    saveClient(newClient);
    const sessionUser = { ...newClient };
    delete sessionUser.password;
    setUser(sessionUser);
    setCurrentUser(sessionUser);
    refreshNotifications(sessionUser.id);
    return { success: true, user: sessionUser };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    setNotifications([]);
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    setCurrentUser(updatedUser);

    if (user.role === 'freelancer') {
      saveFreelancer(updatedUser);
    } else {
      saveClient(updatedUser);
    }
  };

  const quickLogin = (role) => {
    if (role === 'freelancer') {
      const freelancers = getFreelancers();
      const demoFree = freelancers[0];
      const sessionUser = { ...demoFree };
      delete sessionUser.password;
      setUser(sessionUser);
      setCurrentUser(sessionUser);
      refreshNotifications(sessionUser.id);
      return sessionUser;
    } else {
      const clients = getClients();
      const demoClient = clients[0];
      const sessionUser = { ...demoClient };
      delete sessionUser.password;
      setUser(sessionUser);
      setCurrentUser(sessionUser);
      refreshNotifications(sessionUser.id);
      return sessionUser;
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
        refreshNotifications: () => refreshNotifications(user?.id),
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
