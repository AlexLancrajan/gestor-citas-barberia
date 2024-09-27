export interface UserFieldsNoId {
  username: string,
  passwordHash: string,
  email: string,
  phone: string,
  name?: string,
  surname?: string,
  role: 'admin' | 'barber' | 'user'
}

export interface UserFields extends UserFieldsNoId {
  userId: string
}

export interface UserForToken {
  username: string,
  userId: string,
  role: 'admin' | 'barber' | 'user'
}

export type UserNoHashField = Omit<UserFields, 'passwordHash'>;

export class UserNoHash {
  constructor(readonly userNoHashFields: UserNoHashField) { }
}

export class User {
  constructor(readonly userFields: UserFields) { }
}

export class UserNoId {
  constructor(readonly userFieldsNoId: UserFieldsNoId) { }
}