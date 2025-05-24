import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient()

export const checkUserLimit = async (userId, input) => {
  const userLimits = await prisma.user_limits.findUnique({
    where: {
      user_id: userId
    }
  });

  if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);
  
  const userSubscription = await prisma.user_subscriptions.findUnique({
    where: {
      user_id: userId
    }
  });

  if(!userSubscription) throw new Error(`Could not retrieve userSubscription, user id: ${userId}`);
  
  const subscription = await prisma.subscriptions.findUnique({
    where: {
      id: userSubscription.subscription_id
    }
  });

  if(!subscription) throw new Error(`Could not retrieve subscription type, user id: ${userId}`);

  const symbolsDifference = subscription.daily_limit_text - userLimits.used_symbols - input.symbols;
  const audioDifference = subscription.daily_limit_audio - userLimits.used_audio - input.audio;
  const photosDifference = subscription.daily_limit_photos - userLimits.used_photos - input.photos;

  if(symbolsDifference < 0 || audioDifference < 0 || photosDifference < 0) return false;
  return true;
}

export const resetUserLimit = async (userId) => {
  const userLimits = await prisma.user_limits.findUnique({
    where: {
      user_id: userId
    }
  });

  if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);
  
  const userSubscription = await prisma.user_subscriptions.findUnique({
    where: {
      user_id: userId
    }
  });

  if(!userSubscription) throw new Error(`Could not retrieve userSubscription, user id: ${userId}`);
  
  const subscription = await prisma.subscriptions.findUnique({
    where: {
      id: userSubscription.subscription_id
    }
  });

  if(!subscription) throw new Error(`Could not retrieve subscription type, user id: ${userId}`);

  const updatedUserLimits = await prisma.user_limits.update()
}