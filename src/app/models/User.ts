export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  roles?: UserRoles;
  data_id?: string;
  data_modified?: string;
  data_sync?: string;
  read_books?: Object;
  read_shorts?: Object;
  selected_editions?: Object;
}

export interface UserRoles {
  reader: boolean;
  editor?: boolean;
  admin?: boolean;
}
