import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/auth/signin'
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),

    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email'
        },

        password: {
          label: 'Password',
          type: 'password'
        }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.hashedPassword) {
          throw new Error('No account found for that email. Please register first.');
        }

        const isValid = await compare(credentials.password, user.hashedPassword);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          image: user.image ?? null
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};