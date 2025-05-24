import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient()

export const createUser = async (input) => {
  try {
    const { id, username, name, language_code } = input;

    const user = await prisma.users.create({
      data: {
        id: BigInt(id),
        username,
        name,
        language_code
      },
    });

    const subscription = await prisma.user_subscriptions.create({
        data: {
            user_id: BigInt(id)
        }
    });

    const defaultSubscription = await prisma.subscriptions.findUnique({
      where: {
        id: 0
      }
    });

    const limit = await prisma.user_limits.create({
      data: {
        user_id: BigInt(id),
        used_symbols: 0,
        used_audio: 0,
        used_photos: 0
      }
    });

    return user;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return null;
  }
};

export const updateUser = async (input) => {
  const { id, ...rest } = input;

  const existing = await prisma.users.findUnique({ where: { id } });

  if(!existing) {
    console.log(`Could not update user: user with id ${id} don't exist`);
  };

  const data = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value != null)
  );

  if (Object.keys(data).length === 0) return null;

  const user = await prisma.users.update({
    where: {
      id: id
    },
    data
  });

  return user;
}