import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
}

interface CustomSession extends Session {
  user?: {
    id?: string;
  } & Session['user'];
}

export const authOptions: AuthOptions = {  // Ensure this is exported
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { email, password } = credentials;
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (!data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ email: user.email, name: user.name }]);

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
