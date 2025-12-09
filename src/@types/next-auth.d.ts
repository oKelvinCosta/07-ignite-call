import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }

  // Becausa the return from nextAuth don't recognize alone
  // If I use 2 interface with the same name, is incremental the
  interface Session {
    user: User
  }
}
