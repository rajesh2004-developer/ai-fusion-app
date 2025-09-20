'use client';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export function AppSidebar() {
  const {theme, setTheme} = useTheme();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={'/logo.svg'}
                width={60}
                height={60}
                alt="logo"
                className="w-[40px] h-[40px]"
              />
              <h2 className="font-bold text-xl">AI Fusion</h2>
            </div>
            <div>
              {theme == 'light' ? (
                <Button variant="ghost" onClick={() => setTheme('dark')}>
                  <Sun />
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setTheme('light')}>
                  <Moon />
                </Button>
              )}
            </div>
          </div>
          <Button className="mt-7 w-full" size={'lg'}>
            + New Chat
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className={'p-3'}>
            <h2 className="font-bold">Chat</h2>
            <p className="text-sm text-gray-400">
              Sign In to start chatting with multiple Ai models
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-7">
          <Button className={'w-full'} size={'lg'}>
            Sign In/Sign Up
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
