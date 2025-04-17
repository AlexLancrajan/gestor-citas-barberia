/**
 * It contains all the roles permited in the User concept.
 * 
 * Roles {
 *  admin = 'admin',
 *  barber = 'barber',
 *  user = 'user'
 * }
 * 
 */
export enum Roles {
  /**It grants administrator privileges that could potentialy modifiy all the other concepts without restriction. */
  admin = 'admin',

  /**It grants barber privileges that could modify user action + barber fields in the barber domain.*/
  barber = 'barber',

  /**It grants user privileges, and it is the basic role given to an user, it permits modifying user itself and booking appointments. */
  user = 'user'
}

/**
 * It contains all the fields that can be found in database.
 * 
 * Fields: userId, username, passwordHash, email, phone, name, surname, role, missingTrack.
 */
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

/**
 * It contains all the fields necessary to register and modifying a user.
 * 
 * Depending on the privileges given by the role, it can only modify certain fields.
 * 
 * Fields (User role): username, passwordHash (password should be passed in the validation stage), email, phone, name, surname.
 * 
 * Fields (Admin role): User roles + role, missingTrack.
 */
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

/**It contains the fields necessary to login to the system.
 * 
 * Fields: username, password.
 */
export interface UserLoginFields {
  username: string,
  password: string
}

/**It contains some user information necessary in the JWT token encoding/decoding process.
 * 
 * Fields: username, userId, role, missingTrack.
 */
export interface UserForToken {
  username: string,
  userId: string,
  role: Roles,
  missingTrack: number,
}

/**Type to return to the client, it contains all UserFields members except passwordHash. */
export type UserNoHashField = Omit<UserFields, 'passwordHash'>;
