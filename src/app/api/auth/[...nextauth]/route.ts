import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
import { createClient } from '@supabase/supabase-js';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { setSession, clearSession } from '@/stores/slice/sessionSlice';
import { store } from '@/stores/store'; // Import the store

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface CustomToken extends JWT {
  id?: string;
  username?: string; 
}

interface CustomSession extends Session {
  user?: {
    id?: string;
    username?: string;
  } & Session['user'];
}

export const authOptions: AuthOptions = {
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

        // Validate password
        const isValidPassword = password === user.password; // No hashing
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
    newUser: undefined,
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: CustomToken; user?: any }): Promise<CustomToken> {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: CustomToken }): Promise<CustomSession> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string; // Add this line
        session.user.name = token.name as string;
        store.dispatch(setSession(session.user));
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'kakao') {
        const { data, error } = await supabase
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
