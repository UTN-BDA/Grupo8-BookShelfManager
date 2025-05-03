export type User = {
    id: string;
    email: string;
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type CreateUserParams = {
    email: string;
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
  
  export type UpdateUserParams = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;