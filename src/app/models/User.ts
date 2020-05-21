export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  roles?: UserRoles;
}

export interface UserRoles {
  reader: boolean;
  editor?: boolean;
  admin?: boolean;
}