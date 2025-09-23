'use client';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Bold, Moon, Sun, User2, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import UsageCreditProgress from './UsageCreditProgress';

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

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
          {user ? (
            <Button className="mt-7 w-full" size={'lg'}>
              + New Chat
            </Button>
          ) : (
            <SignInButton>
              <Button className="mt-7 w-full" size={'lg'}>
                + New Chat
              </Button>
            </SignInButton>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className={'p-3'}>
            <h2 className="font-bold">Chat</h2>
            {!user && <p className="text-sm text-gray-400">
              Sign In to start chatting with multiple Ai models
            </p>}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">
          {!user ? (
            <SignInButton mode="modal">
              <Button className={'w-full'} size={'lg'}>
                Sign In/Sign Up
              </Button>
            </SignInButton>
          ) : (
            <div>
              <UsageCreditProgress />
              <Button className={'w-full mb-3'}>
                <Zap /> Upgrade
              </Button>
              <Button className="flex gap-5 w-full" variant={'ghost'}>
                <User2 /> <h2>Settings</h2>
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
