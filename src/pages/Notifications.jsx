import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Clock, FileCheck, Send, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../utils/storage';
import EmptyState from '../components/EmptyState';

export default function Notifications() {
  const { user, refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const navigate = useNavigate();

  const loadNotifs = () => {
    const all = getNotifications();
    const userNotifs = all.filter((n) => n.userId === user?.id);
    setNotifications(userNotifs);
    refreshNotifications();
  };

  useEffect(() => {
    loadNotifs();
  }, [user]);

  const handleMarkAsRead = (id, link) => {
    markNotificationAsRead(id);
    loadNotifs();
    if (link) {
      navigate(link);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(user?.id);
    loadNotifs();
  };

  const filteredNotifs = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="sb-container sb-container-narrow" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '0.25rem' }}>Notifications</h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.98rem' }}>
            Stay informed about proposals, milestone deliveries, and verification feedback.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <CheckCheck size={16} />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.75rem',
          marginBottom: '1.75rem',
        }}
      >
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {filteredNotifs.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={
            filter === 'unread'
              ? 'You have caught up with all your notifications!'
              : 'You will receive notifications here when proposals are submitted, accepted, or verified.'
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id, item.link)}
              className="sb-card sb-card-hover"
              style={{
                padding: '1.25rem 1.5rem',
                cursor: item.link ? 'pointer' : 'default',
                backgroundColor: item.read ? 'var(--color-white)' : '#FAFDFB',
                borderLeft: item.read ? '1px solid var(--color-border)' : '4px solid var(--color-emerald)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: item.type === 'revision' ? 'var(--color-terracotta-light)' : 'var(--color-emerald-light)',
                    color: item.type === 'revision' ? 'var(--color-terracotta)' : 'var(--color-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.type === 'verification' ? (
                    <FileCheck size={18} />
                  ) : item.type === 'revision' ? (
                    <AlertCircle size={18} />
                  ) : item.type === 'completion' ? (
                    <CheckCheck size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--color-terracotta)',
                          display: 'inline-block',
                        }}
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                    {item.message}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>
                    {item.time || 'Recently'}
                  </span>
                </div>
              </div>

              {item.link && (
                <div style={{ color: 'var(--color-emerald)', alignSelf: 'center', flexShrink: 0 }}>
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
