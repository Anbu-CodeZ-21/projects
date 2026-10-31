import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Bell,
  User,
  LogOut,
  Settings,
  PlusCircle,
  Search,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  FileCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, isAuthenticated, role, logout, unreadCount, quickLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleQuickSwitch = (targetRole) => {
    quickLogin(targetRole);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    if (targetRole === 'freelancer') {
      navigate('/freelancer/dashboard');
    } else {
      navigate('/client/dashboard');
    }
  };

  return (
    <header className="sb-navbar">
      <div className="sb-container">
        <div className="sb-navbar-inner">
          {/* Brand Logo */}
          <Link
            to={
              !isAuthenticated
                ? '/'
                : role === 'freelancer'
                ? '/freelancer/dashboard'
                : '/client/dashboard'
            }
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none' }}
          >
            <Logo size="md" />
          </Link>

          {/* Navigation Menu by Role */}
          <nav>
            <ul className="sb-nav-links">
              {!isAuthenticated && (
                <>
                  <li>
                    <NavLink to="/projects" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Explore Projects
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/freelancers" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Find Freelancers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/about" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      About Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Contact
                    </NavLink>
                  </li>
                </>
              )}

              {/* Freelancer-Specific Navigation */}
              {isAuthenticated && role === 'freelancer' && (
                <>
                  <li>
                    <NavLink to="/freelancer/dashboard" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/projects" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Explore Projects
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/freelancer/proposals" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      My Proposals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/freelancer/projects" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      My Projects
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/work-verification" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Work Verification
                    </NavLink>
                  </li>
                </>
              )}

              {/* Client-Specific Navigation */}
              {isAuthenticated && role === 'client' && (
                <>
                  <li>
                    <NavLink to="/client/dashboard" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/client/projects" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      My Projects
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/freelancers" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Find Freelancers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/work-verification" className={({ isActive }) => `sb-nav-link ${isActive ? 'active' : ''}`}>
                      Work Verification
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Right Action Area */}
          <div className="sb-nav-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log In
                </Link>
                <Link to="/choose-role" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Client-only Post Project CTA */}
                {role === 'client' && (
                  <Link to="/client/post-project" className="btn btn-emerald btn-sm" style={{ gap: '0.4rem' }}>
                    <PlusCircle size={15} />
                    <span>Post a Project</span>
                  </Link>
                )}

                {/* Notifications Link */}
                <Link
                  to="/notifications"
                  className="btn btn-ghost btn-sm"
                  style={{ position: 'relative', padding: '0.5rem' }}
                  title="Notifications"
                >
                  <Bell size={19} color="var(--color-primary)" />
                  {unreadCount > 0 && <span className="notif-badge-pill">{unreadCount}</span>}
                </Link>

                {/* User Dropdown */}
                <div className="user-menu-wrap" ref={dropdownRef}>
                  <button
                    type="button"
                    className="user-badge-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                      alt={user?.name}
                      className="user-avatar-sm"
                    />
                    <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {user?.name?.split(' ')[0]}
                      </div>
                      <span className={role === 'freelancer' ? 'badge-role-freelancer' : 'badge-role-client'} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                        {role === 'freelancer' ? 'Freelancer' : 'Client'}
                      </span>
                    </div>
                    <ChevronDown size={14} color="var(--color-muted-text)" />
                  </button>

                  {dropdownOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>{user?.email}</div>
                      </div>

                      {role === 'freelancer' ? (
                        <>
                          <Link
                            to={`/freelancers/${user?.id}`}
                            className="user-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <User size={16} />
                            <span>My Public Profile</span>
                          </Link>
                          <Link
                            to="/freelancer/proposals"
                            className="user-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Send size={16} />
                            <span>My Proposals</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/client/projects"
                            className="user-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Layers size={16} />
                            <span>Posted Projects</span>
                          </Link>
                          <Link
                            to="/client/post-project"
                            className="user-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <PlusCircle size={16} />
                            <span>Post New Project</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/work-verification"
                        className="user-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FileCheck size={16} />
                        <span>Work Verification</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="user-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Profile Settings</span>
                      </Link>

                      {/* Demo Switcher Quick Action */}
                      <div style={{ borderTop: '1px solid var(--color-border)', margin: '0.4rem 0', padding: '0.4rem 1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-muted-text)', fontWeight: 700, marginBottom: '0.35rem' }}>
                          Switch Demo Account
                        </div>
                        {role === 'freelancer' ? (
                          <button
                            type="button"
                            onClick={() => handleQuickSwitch('client')}
                            className="btn btn-outline-primary btn-sm btn-block"
                            style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem' }}
                          >
                            Switch to Client Demo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickSwitch('freelancer')}
                            className="btn btn-outline-primary btn-sm btn-block"
                            style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem' }}
                          >
                            Switch to Freelancer Demo
                          </button>
                        )}
                      </div>

                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="user-dropdown-item"
                          style={{ width: '100%', color: 'var(--color-terracotta)' }}
                        >
                          <LogOut size={16} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.25rem', color: 'var(--color-charcoal)' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                  <Link to="/projects" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Explore Projects</Link>
                  <Link to="/freelancers" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Find Freelancers</Link>
                  <Link to="/about" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                  <Link to="/contact" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem' }}>
                    <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                    <Link to="/choose-role" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </div>
                </>
              ) : role === 'freelancer' ? (
                <>
                  <Link to="/freelancer/dashboard" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/projects" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Explore Projects</Link>
                  <Link to="/freelancer/proposals" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>My Proposals</Link>
                  <Link to="/freelancer/projects" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>My Projects</Link>
                  <Link to="/work-verification" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Work Verification</Link>
                  <Link to={`/freelancers/${user?.id}`} className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Public Profile</Link>
                  <Link to="/notifications" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Notifications ({unreadCount})</Link>
                  <Link to="/settings" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
                  <button type="button" onClick={handleLogout} className="btn btn-terracotta btn-block" style={{ marginTop: '1rem' }}>Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/client/dashboard" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/client/post-project" className="btn btn-emerald btn-block" onClick={() => setMobileMenuOpen(false)}>+ Post a Project</Link>
                  <Link to="/client/projects" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>My Projects</Link>
                  <Link to="/freelancers" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Find Freelancers</Link>
                  <Link to="/work-verification" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Work Verification</Link>
                  <Link to="/notifications" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Notifications ({unreadCount})</Link>
                  <Link to="/settings" className="sb-nav-link" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
                  <button type="button" onClick={handleLogout} className="btn btn-terracotta btn-block" style={{ marginTop: '1rem' }}>Log Out</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
