'use client';

import { Car, LogOut, Map, Settings, User } from 'lucide-react';
import * as React from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/auth-store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NotificationToggle } from './profile/notification-toggle';

// Menüpontok definíciója
const data = {
  navMain: [
    {
      title: 'Térkép',
      url: '/map',
      icon: Map,
    },
    {
      title: 'Parkolásaim',
      url: '/my-sessions',
      icon: Car,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const { user, token, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logout();
      router.push('/');
    }
  };

  // If user is not logged in yet
  const displayName = user?.name || 'Felhasználó';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.picture || '';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Map className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">Parking App</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <NotificationToggle />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={displayAvatar} alt={displayName} />
                    <AvatarFallback className="rounded-lg">
                        {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{displayName}</span>
                    <span className="truncate text-xs">{displayEmail}</span>
                  </div>
                  <Settings className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="text-red-500 cursor-pointer" 
                    onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Kijelentkezés
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
