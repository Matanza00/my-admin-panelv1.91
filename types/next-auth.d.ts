import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    permissions: string[];
    accessToken: string;
    username: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      permissions: string[];
      accessToken: string;
      username: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    permissions: string[];
    accessToken: string;
    username: string;
  }
}
