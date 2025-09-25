'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { DefaultModel } from '@/shared/AiModelsShared';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({ children, ...props }) {
  const { user } = useUser();
  const [AiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetail, setUserDetail] = useState();
  const [messages, setMessages] = useState();

  useEffect(() => {
    if (user) {
      createNewuser();
    }
  }, [user]);

  useEffect(() => {
    if (AiSelectedModels && user?.primaryEmailAddress?.emailAddress) {
      updateAiModelSelectionPref();
    }
  }, [AiSelectedModels]);

  const updateAiModelSelectionPref = async () => {
    try {
      const docref = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
      await updateDoc(docref, {
        selectedModel: AiSelectedModels,
      });
    } catch (error) {
      console.error('Error updating AI model preferences:', error);
    }
  };

  const createNewuser = async () => {
    const userRef = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('User Exists');
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModel ?? DefaultModel);
      setUserDetail(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMessage: 5,
        Plan: 'Free',
        credits: 1000,
      };
      await setDoc(userRef, userData);
      setUserDetail(userData);
      console.log('New User Created');
    }
  };

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AiSelectedModelContext.Provider
          value={{
            AiSelectedModels,
            setAiSelectedModels,
            messages,
            setMessages,
          }}
        >
          <SidebarProvider>
            <AppSidebar />

            <div className="w-full">
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  );
}

export default Provider;
