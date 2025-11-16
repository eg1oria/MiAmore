import { randomUUID } from 'crypto';
import { JSONFilePreset } from 'lowdb/node';

export interface IUser {
  id: string;
  username: string;
  email: string;
  createdAt: number;
}

export const database = await JSONFilePreset<Record<string, IUser>>('users.json', {});

export class Users {
  static getOne(id: string): IUser | undefined {
    return database.data[id];
  }

  static getAll(): IUser[] {
    return Object.values(database.data);
  }

  static findOne(predicate: (user: IUser) => boolean): IUser | undefined {
    return Users.getAll().find(predicate);
  }

  static async create(username: string, email: string): Promise<IUser> {
    if (Users.findOne((user) => user.email === email)) {
      throw new Error('Email already in use');
    }

    const user: IUser = {
      id: randomUUID(),
      email,
      username,
      createdAt: Date.now(),
    };

    await database.update((data) => {
      data[user.id] = user;
    });

    return user;
  }

  static async update(
    id: string,
    updates: Partial<Omit<IUser, 'id' | 'createdAt'>>,
  ): Promise<IUser | undefined> {
    const user = Users.getOne(id);

    if (!user) {
      return undefined;
    }

    const updatedUser = { ...user, ...updates };

    await database.update((data) => {
      data[id] = updatedUser;
    });

    return updatedUser;
  }

  static async delete(id: string): Promise<boolean> {
    const user = Users.getOne(id);

    if (!user) {
      return false;
    }

    await database.update((data) => {
      delete data[id];
    });

    return true;
  }
}
