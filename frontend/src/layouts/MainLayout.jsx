import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  LogOut, 
  Check, 
  TrendingUp, 
  FileText, 
  Users,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const { 
    theme, 
    toggleTheme, 
    notifications, 
    markAllNotificationsRead, 
    leads 
  } = useApp();
  const { user, logout } = useAuth();

  // Derive display values from real user
  const isAdmin = user?.role === 'admin';
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const userRole = isAdmin ? 'Administrator' : 'Lead Counselor';
  const userEmail = user?.email || '';
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notifRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle outside clicks to close menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/leads', label: 'Leads', icon: Users },
    ...(isAdmin ? [{ path: '/form-builder', label: 'Form Builder', icon: FileText }] : []),
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div className="hidden xs:block">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
                  EduLead
                </span>
                <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  CRM Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 h-full">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/leads' && location.pathname.startsWith('/leads'));
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `
                    relative px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200
                    ${isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'}
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-[-17px] left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Actions Panel */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Quick search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </form>


            {/* Notification Menu */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className={`p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/20 dark:border-slate-800/20 transition-all duration-200 relative ${showNotifMenu ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-80 glass-panel-heavy rounded-2xl shadow-xl overflow-hidden z-50 text-left border border-slate-200/60 dark:border-slate-800/60"
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/20 dark:to-purple-950/20 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Alerts & Updates</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">No alerts available</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-3.5 transition-colors duration-150 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 ${!notif.read ? 'bg-indigo-50/20 dark:bg-indigo-950/5' : ''}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                notif.type === 'success' ? 'bg-emerald-500' :
                                notif.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                              }`} />
                              <div className="flex-1">
                                <h4 className={`text-xs font-bold ${!notif.read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                  {notif.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                <span className="block text-[9px] text-slate-400 mt-1">{notif.time}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-purple-500/10 shrink-0">
                {userInitials}
              </div>
              {/* Name + Role - Hidden on mobile */}
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{displayName}</span>
                </div>
                <span className="block text-[10px] text-slate-400 font-semibold">{userRole}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200/20 dark:border-rose-900/20 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <div className="md:hidden" ref={mobileMenuRef}>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
              >
                <div className="px-4 py-4 space-y-2">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit} className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none dark:text-slate-200"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  </form>

                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                        ${isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'}
                      `}
                    >
                      <link.icon className="w-4.5 h-4.5" />
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-slate-100/40 dark:bg-slate-950/40 text-center">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          EduLead CRM © 2026. Made for Student Admissions Excellence.
        </span>
      </footer>
    </div>
  );
}
