import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const ADMIN_USERS = [
  { id: '1', name: 'admin', emailEnvKey: 'ADMIN_EMAIL', passwordEnvKey: 'ADMIN_PASSWORD' },
  { id: '2', name: 'team',  emailEnvKey: 'TEAM_EMAIL',  passwordEnvKey: 'TEAM_PASSWORD'  },
] as const

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Adresse email', type: 'email' },
        password: { label: 'Mot de passe',  type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.toLowerCase().trim()

        const user = ADMIN_USERS.find(
          (u) => process.env[u.emailEnvKey]?.toLowerCase().trim() === email
        )
        if (!user) return null

        const storedPassword = process.env[user.passwordEnvKey]
        if (!storedPassword) return null

        if (credentials.password !== storedPassword) return null

        return { id: user.id, name: user.name, email }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
