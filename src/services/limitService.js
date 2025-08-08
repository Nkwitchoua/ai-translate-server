import { PrismaClient } from '../generated/prisma/index.js';
import { getSubscriptionTypeById, getUserSubscriptionById, getUserSubscriptionTypeById } from './subscriptionService.js';
import * as redisClient from "../clients/redisClient.js"

const prisma = new PrismaClient();

export const limitService = {
  getUserLimits:  async (userId) => {
    const exists = await redisClient.hasLimit(userId);
    if(exists) {
      return await redisClient.getLimit(userId);
    } else {
      limitService.setUserLimit(userId)
      .then(async res => {
        return await redisClient.getLimit(userId);
      });
    }
  
  },

  checkUserTextLimit: async (userId, text) => {
    console.log("start checking")
    const userLimits = await limitService.getUserLimits(userId);

    if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);

    const diff = userLimits.text - text;
    console.log("something", diff);
    console.log(userLimits);

    if(diff < 0) return false;
    return true;
  },

  checkUserAudioLimit: async (userId, duration) => {
    const userLimits = await limitService.getUserLimits(userId);

    if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);

    const diff = userLimits.audio - duration;

    if(diff < 0) return false;
    return true;
  },

  checkUserImageLimit: async (userId, img) => {
    const userLimits = await limitService.getUserLimits(userId);

    if(!userLimits) throw new Error(`Could not retrieve user limits, user id: ${userId}`);
    
    const userSubscription = await getUserSubscriptionById(userId);

    if(!userSubscription) throw new Error(`Could not retrieve userSubscription, user id: ${userId}`);
    
    const subscription = await getSubscriptionTypeById(userSubscription.subscription_id);

    if(!subscription) throw new Error(`Could not retrieve subscription type, user id: ${userId}`);

    const diff = userLimits.photos - img;

    if(diff < 0) return false;
    return true;
  },

  resetUserLimit: async (userId) => {
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
  },

  setUserLimit: async (userId) => {
    const subscription = await getUserSubscriptionTypeById(userId);

    const limits = {
      text: subscription.daily_limit_text,
      audio: subscription.daily_limit_audio,
      photos: subscription.daily_limit_photos
    };
    console.log('limits to set:', limits);
    await redisClient.setLimit(userId, limits);
  },

  decrementUserLimit: async (userId, field, value) => {
    const exists = await redisClient.hasLimit(userId);

    if(!exists) await limitService.setUserLimit(userId);

    await redisClient.hincrbyLimit(userId, field, value * (-1));
  }
}

// export const changeUserLimit