/**
 * Validation utilities for SkillBridge forms
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateLoginForm({ email, password, role }) {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!role || (role !== 'freelancer' && role !== 'client')) {
    errors.role = 'Please select your account type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFreelancerRegister(data) {
  const errors = {};
  if (!data.name || !data.name.trim()) errors.name = 'Full name is required';
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.title || !data.title.trim()) {
    errors.title = 'Professional headline/title is required (e.g. Senior MERN Stack Developer)';
  }

  if (!data.hourlyRate || Number(data.hourlyRate) <= 0) {
    errors.hourlyRate = 'Please provide a valid hourly rate in ₹';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateClientRegister(data) {
  const errors = {};
  if (!data.name || !data.name.trim()) errors.name = 'Contact person name is required';
  if (!data.companyName || !data.companyName.trim()) errors.companyName = 'Company / organization name is required';
  if (!data.email || !data.email.trim()) {
    errors.email = 'Work email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProjectPost(data) {
  const errors = {};
  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Project title must be at least 5 characters';
  }
  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Please provide a detailed description (at least 20 characters)';
  }
  if (!data.category) {
    errors.category = 'Please select a category';
  }
  if (!data.budget || Number(data.budget) < 500) {
    errors.budget = 'Minimum project budget must be at least ₹500';
  }
  if (!data.skills || (Array.isArray(data.skills) && data.skills.length === 0) || (typeof data.skills === 'string' && !data.skills.trim())) {
    errors.skills = 'Please specify at least one required skill';
  }
  if (!data.deadline) {
    errors.deadline = 'Please specify a deadline date';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProposal(data) {
  const errors = {};
  if (!data.coverLetter || data.coverLetter.trim().length < 20) {
    errors.coverLetter = 'Cover letter must be at least 20 characters describing your approach';
  }
  if (!data.bidAmount || Number(data.bidAmount) <= 0) {
    errors.bidAmount = 'Please enter a valid bid amount in ₹';
  }
  if (!data.estimatedDays || Number(data.estimatedDays) <= 0) {
    errors.estimatedDays = 'Please provide estimated delivery timeline in days';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateWorkSubmission(data) {
  const errors = {};
  if (!data.deliveryUrl || !data.deliveryUrl.trim()) {
    errors.deliveryUrl = 'Delivery URL is required (e.g. GitHub repo, Figma link, Live URL, Drive link)';
  } else if (!isValidUrl(data.deliveryUrl)) {
    errors.deliveryUrl = 'Please enter a valid URL including http:// or https://';
  }
  if (!data.deliveryNotes || data.deliveryNotes.trim().length < 15) {
    errors.deliveryNotes = 'Please provide detailed delivery notes (at least 15 characters)';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
