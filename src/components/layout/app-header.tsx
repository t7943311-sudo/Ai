'use client';

import Link from 'next/link';
import {
  CircleUser,
  Menu,
  Home,
  FileScan,
  GitCompareArrows,
  PenSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppLogo } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/analyze', label: 'Analyze Resume', icon: FileScan },
    { href: '/match-job', label: 'Match Job', icon: GitCompareArrows },
    { href: '/rewrite', label: 'Rewrite Bullets', icon: PenSquare },
];

export function AppHeader() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <AppLogo className="h-6 w-6" />
              <span>CareerBoost AI</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Can be used for search or breadcrumbs later */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {userAvatar ? (
                <Image
                src={userAvatar.imageUrl}
                width={36}
                height={36}
                alt={userAvatar.description}
                className="rounded-full"
                data-ai-hint={userAvatar.imageHint}
                />
            ) : (
                <CircleUser className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
