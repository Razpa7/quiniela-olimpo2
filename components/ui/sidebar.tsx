'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Trophy,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/historial', label: 'Historial de Aciertos', icon: Trophy },
  { href: '/resultados', label: 'Resultados', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-surface-dark via-surface to-surface-dark border-r border-border z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-electric flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-gold animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-greek">Olimpo</h1>
            <p className="text-xs text-gray-500">Quiniela Predictor</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item?.icon ?? LayoutDashboard;
          const isActive = pathname === item?.href;

          return (
            <Link key={item?.href ?? ''} href={item?.href ?? '/'}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-gradient-to-r from-gold/20 to-electric/10 text-gold'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-gold to-electric rounded-r-full"
                  />
                )}
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item?.label ?? ''}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Decorative Greek Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gold/5 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-center text-xs text-gray-600">
          <p className="font-greek">&quot;La suerte favorece a los preparados&quot;</p>
          <p className="mt-1 text-gold/50">- El Oráculo del Olimpo</p>
        </div>
      </div>
    </aside>
  );
}
