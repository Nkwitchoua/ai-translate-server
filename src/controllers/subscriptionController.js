import { PrismaClient } from '../generated/prisma/index.js';
import { safeJson } from '../utils/safeJson.js';

const prisma = new PrismaClient()

export const getUserSubscriptionById = async (req, res) => {
    const userId = req.params.id;
    const activeSub = await prisma.user_subscriptions.findFirst({
        where: {
            user_id: BigInt(userId),
            is_active: true
        },
        include: {
            subscription: true
        }
    });

    res.json(safeJson(activeSub));
}