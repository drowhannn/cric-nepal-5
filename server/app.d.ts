declare module '#auth-utils' {
  interface UserSession {
    // @ts-expect-error fix this later
    user: {
      id: string
      email: string
      fullName: string
      phone: string | null
      isAdmin: boolean
      username: string
    }
  }
}

export { }
