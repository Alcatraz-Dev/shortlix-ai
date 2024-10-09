'use client'
import { useUser } from '@clerk/nextjs'
import { db } from 'configs/db';
import { Users } from 'configs/schema';
import { eq } from 'drizzle-orm';
import React, { useContext, useEffect, useState } from 'react'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { VideoDataContext } from './_context/VideoDataContext';

function Provider({ children }) {
  const [videoData, setVideoData] = useState({}); // Initialize videoData
  const { user } = useUser();
  useEffect(() => {
    user && isNewUser();
  }, [user])
  const isNewUser = async () => {
    const result = await db.select().from(Users).where(eq(Users.email, user?.primaryEmailAddress?.emailAddress)); {
      if (!result[0]) {
        await db.insert(Users).values({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          imageUrl: user?.imageUrl,
        })
      }
    }
  }

  return (

    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <div>{children}</div>
      </VideoDataContext.Provider>
    </PayPalScriptProvider>

  )
}
// Custom hook to use the VideoDataContext
// Custom hook to use the VideoDataContext
export const useVideoData = () => {
  return useContext(VideoDataContext);
};
export default Provider