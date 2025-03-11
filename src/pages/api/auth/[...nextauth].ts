import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// Extend NextAuth types to include custom fields
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    permissions: string[];
    accessToken: string;
    username: string;
    department: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    permissions: string[];
    accessToken: string;
    username: string;
    department: string;
  }
}

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials): Promise<NextAuthUser | null> => {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Missing identifier or password');
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          },
          include: {
            department: true, // Include department
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          throw new Error('Invalid email/username or password');
        }

        const permissions = user.role?.permissions
          .filter((rp) => rp.permission !== null)
          .map((rp) => rp.permission!.name) || [];

        const accessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role?.name || '',
            permissions,
            department: user.department?.name || '',
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role?.name || '',
          permissions,
          accessToken,
          department: user.department?.name || '',
        } as NextAuthUser & { username: string; accessToken: string; department: string };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || '';
        token.permissions = user.permissions || [];
        token.accessToken = user.accessToken || '';
        token.username = user.username || '';
        token.department = user.department || ''; // Include department
      }
      console.log('JWT Token:', token);


      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          role: token.role,
          permissions: token.permissions|| [],
          accessToken: token.accessToken,
          username: token.username,
          department: token.department|| '', // Include department in session
        };
        console.log('Session:', session);
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
