export interface UserPayload {
  userId: string;
}

export interface NoteInput {
  title: string;
  description: string;
  status?: "active" | "archived" | "deleted";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginCredentials {
  name: string;
}
