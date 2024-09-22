export interface userFieldsNoId {
  username: string,
  passwordHash: string,
  email: string,
  phone: string,
  name?: string,
  surname?: string,
  role: 'admin' | 'barber' | 'user'
}

export type userNoHash = Omit<User, 'passwordHash'>;

export interface userFields extends userFieldsNoId {
  userId: string
}

export interface UserForToken {
  username: string,
  userId: string,
  role: 'admin' | 'barber' | 'user'
}

export class User {
  constructor(readonly userFields: userFields) { }
}

export class UserNoId {
  constructor(readonly userFieldsNoId: userFieldsNoId) { }
}