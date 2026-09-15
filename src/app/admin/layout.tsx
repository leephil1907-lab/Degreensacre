'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Home,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Properties', href: '/admin/properties', icon: Home },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Compose Email', href: '/admin/compose', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <img src="/logo-icon.png" alt="Logo" className="w-8 h-8 mr-3" />
          <div>
            <div className="font-bold text-sm">Admin Panel</div>
            <div className="text-[10px] text-gray-400">De-Greenacres</div>
          </div>
          <button
            className="lg:hidden ml-auto text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-forest text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
            <Shield className="w-5 h-5" />
            <div>
              <div className="text-xs font-semibold text-white">Super Admin</div>
              <div className="text-[10px]">Full Access</div>
            </div>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full rounded-lg hover:bg-gray-800">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            className="lg:hidden text-gray-600 hover:text-charcoal"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-charcoal">
              {navItems.find((n) => n.href === pathname)?.label || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-charcoal transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-magenta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
