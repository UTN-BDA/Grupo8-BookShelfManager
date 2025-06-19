export type User = {
    id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type CreateUserParams = {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  
  export type UpdateUserParams = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;