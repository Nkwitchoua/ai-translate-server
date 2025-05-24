import { PrismaClient } from '../generated/prisma/index.js';
import { createUser, updateUser } from "../services/userService.js";
import { safeJson } from '../utils/safeJson.js';

const prisma = new PrismaClient();

export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "User ID is incorrect or missing" });
    }

    const user = await prisma.users.findFirst({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `User info ${userId}`, data: safeJson(user) });
  } catch (error) {
    console.error('Could not get user data:', error);
    res.status(500).json({ error: "Could not get user data" });
  }
};

export const createUserAsync = async (req, res) => {
  try {
    const { id } = req.body;

    if (id == null) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const user = await createUser(req.body);

    const safeUser = JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Could not create user:', error);
    res.status(500).json({ error: 'Could not create user' });
  }
};

export const updateUserAsync = (req, res) => {
  const body = req.body;
  if(isNaN(body.id)) return res.status(400);

  try {
    const user = updateUser(body);

    res.status(201).json(user);
  } catch (error) {
    console.error('Could not update user language code:', error);
    res.status(500).json({ error: 'Could not update user language code' });
  }
}