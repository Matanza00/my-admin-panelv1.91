// pages/_app.js
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Import the global styles here

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
