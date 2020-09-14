const { StripeSubscription } = require('../models');
const stripeService = require('./stripeService');

const cronService = {
  async updateSubscription() {
    const subscription = await StripeSubscription.getAllForCron();
    if (subscription) {
      const toMailUsers = await Promise.all(
        subscription.map(async (subscribe) => {
          const subscribeDetail = await StripeSubscription.getBy({
            id: subscribe.id,
          });
          const diffDays = await stripeService.checkSubscribeEndDate(subscribeDetail);
          if (diffDays === 1) return subscribe;
          if (diffDays === 0 || diffDays < 0)
            await subscribeDetail.updateInstance(subscribeDetail.id, {
              subscriptionStatus: 'cancel',
            });
        }),
      );
      return toMailUsers;
    }
  },
};
module.exports = cronService;
