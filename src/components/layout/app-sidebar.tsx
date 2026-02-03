'use client';

import Link from 'next/link';
import {
  Bell,
  Home,
  FileScan,
  GitCompareArrows,
  PenSquare,
  Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLogo } from '../icons';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/analyze', label: 'Analyze Resume', icon: FileScan },
  { href: '/match-job', label: 'Match Job', icon: GitCompareArrows },
  { href: '/rewrite', label: 'Rewrite Bullets', icon: PenSquare, badge: 'New' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <AppLogo className="h-6 w-6 text-primary" />
            <span className="">CareerBoost AI</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
            <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
                <Settings className="h-4 w-4" />
                Settings
            </Link>
        </div>
      </div>
    </div>
  );
}
