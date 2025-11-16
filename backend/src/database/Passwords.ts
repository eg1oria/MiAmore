import { JSONFilePreset } from 'lowdb/node';
import { pbkdf2Sync } from 'node:crypto';

const database = await JSONFilePreset<Record<string, string>>('passwords.json', {});

export class Passwords {
  static getOne(userId: string): string | undefined {
    return database.data[userId];
  }

  static async create(userId: string, password: string): Promise<void> {
    await database.update((data) => {
      data[userId] = Passwords._hashPassword(password);
    });
  }

  static verify(userId: string, password: string): boolean {
    const hashedPassword = Passwords.getOne(userId);

    if (!hashedPassword) {
      return false;
    }

    return hashedPassword === Passwords._hashPassword(password);
  }

  static async update(userId: string, newPassword: string): Promise<void> {
    await database.update((data) => {
      data[userId] = Passwords._hashPassword(newPassword);
    });
  }

  static async delete(userId: string): Promise<void> {
    await database.update((data) => {
      delete data[userId];
    });
  }

  private static _hashPassword(password: string): string {
    return pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
  }
}
