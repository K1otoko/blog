export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
}
export interface User {
  id: string
  name?: string
  username?: string
  email?: string
  avatar?: string
  phone?: string
  role: Role
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}
