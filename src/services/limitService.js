import { PrismaClient } from '../generated/prisma/index.js';
import { getSubscriptionTypeById, getUserSubscriptionById } from './subscriptionService.js';

const prisma = new PrismaClient();

export const getUserLimits =  async (userId) => {
  const userLimits = await prisma.user_limits.findUnique({
    where: {
      user_id: userId
    }
  });

  return userLimits ? userLimits : null;
}

export const checkUserTextLimit = async (userId, symbols) => {
  const userLimits = await getUserLimits(userId);

  if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);
  
  const userSubscription = await getUserSubscriptionById(userId);

  if(!userSubscription) throw new Error(`Could not retrieve userSubscription, user id: ${userId}`);
  
  const subscription = await getSubscriptionTypeById(userSubscription.subscription_id);

  if(!subscription) throw new Error(`Could not retrieve subscription type, user id: ${userId}`);

  const symbolsDifference = subscription.daily_limit_text - userLimits.used_symbols - symbols;

  if(symbolsDifference < 0) return false;
  return true;
}

export const checkUserAudioLimit = async (userId, audio) => {
  const userLimits = await getUserLimits(userId);

  if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);
  
  const userSubscription = await getUserSubscriptionById(userId);

  if(!userSubscription) throw new Error(`Could not retrieve userSubscription, user id: ${userId}`);
  
  const subscription = await getSubscriptionTypeById(userSubscription.subscription_id);

  if(!subscription) throw new Error(`Could not retrieve subscription type, user id: ${userId}`);

  const audioDifference = subscription.daily_limit_audio - userLimits.used_audio - audio;

  if(audioDifference < 0) return false;
  return true;
}

export const checkUserImageLimit = async (userId, img) => {
  const userLimits = await getUserLimits(userId);

  if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);
  
  const userSubscription = await getUserSubscriptionById(userId);

  if(!userSubscription) throw new Error(`Could not retrieve userSubscription, user id: ${userId}`);
  
  const subscription = await getSubscriptionTypeById(userSubscription.subscription_id);

  if(!subscription) throw new Error(`Could not retrieve subscription type, user id: ${userId}`);

  const audioDifference = subscription.daily_limit_photos - userLimits.used_photos - img;

  if(audioDifference < 0) return false;
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