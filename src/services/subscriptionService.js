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

export const updateUserSubscription = async (input) => {
    const { userId, subscriptionId } = input;

    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const subscription = await prisma.user_subscriptions.update({
        where: {
            user_id: userId
        },
        data: {
            subscription_id: subscriptionId,
            expires_at: oneMonthLater
        }
    });

    return subscription;
}