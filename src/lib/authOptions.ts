// src/lib/authOptions.ts
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
import { createClient } from '@supabase/supabase-js';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface CustomToken extends JWT {
  id?: string;
  username?: string;
  accessToken?: string;
}

interface CustomSession extends Session {
  user?: {
    id?: string;
    username?: string;
  } & Session['user'];
  accessToken?: string;
}

export const authOptions: AuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,  // Add this line to include the secret
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { id, password } = credentials;
        
        // Fetch the user from the Supabase users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', id)
          .single();

        if (error || !data) {
          return null;
        }

        const user = data;

        // Validate password (consider using a secure hashing mechanism in production)
        const isValidPassword = password === user.password;
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          name: user.name,
        };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds, extend session duration
    updateAge: 24 * 60 * 60,  // Extend session every 24 hours on active use
  },
  callbacks: {
    async jwt({ token, user }: { token: CustomToken; user?: any }): Promise<CustomToken> {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: CustomToken }): Promise<CustomSession> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'kakao') {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('username', user.name)
          .single();

        if (!data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ username: user.name, name: user.name }]);

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }
        }
      }
      return true;
    },
  },
};
