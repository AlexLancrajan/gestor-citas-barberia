/**
 * User fields and concept definition:
 * 1: UserFields: Contains all the fields.
 * 2: UserRegModFieds: Contains the inputs for registering and modifying user.
 * 3: UserLoginFields: Contains the necesary fields for login purposes.
 * 4: UserForToken: Contains the necesary fields to create a jwt token.
 * 5: UserNoHashFields: Used for UserNoHash concept.
 * 
 * Concepts:
 * 1: UserNoHash: Returning value of user excluding passwordHash.
 * 2: User: complete definition of user, just for login purposes.
 */

// Fields of users for it's variations.

export enum Roles {
  admin = 'admin',
  barber = 'barber',
  user = 'user'
}

export interface UserFields {
  userId: string,
  username: string,
  passwordHash: string,
  email: string,
  phone: string,
  name?: string,
  surname?: string,
  role: Roles,
  missingTrack: number,
}

export interface UserRegModFields {
  username: string,
  passwordHash: string,
  email: string,
  phone: string,
  name?: string,
  surname?: string,
  role: Roles,
  missingTrack?: number,
}

export interface UserLoginFields {
  username: string,
  password: string
}

export interface UserForToken {
  username: string,
  userId: string,
  role: Roles,
  missingTrack: number,
}

export type UserNoHashField = Omit<UserFields, 'passwordHash'>;
