import options from "./config";
import Stripe from "stripe";


if(!options.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is not defined. Add it to your .env file');
}

const stripe = new Stripe(options.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
});

export const createPaymentIntent = async(
  amount: number,
  currency: string,
  description: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      automatic_payment_methods: { enabled: true }
    });

    return paymentIntent;
  } catch (error: unknown) {
    if(error instanceof Error)
      throw new Error(error.message);
    else
      throw new Error('Failed to create payment intent details');
  }
};

export const getPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );
    return paymentIntent;
  } catch (error: unknown) {
    if(error instanceof Error)
      throw new Error(error.message);
    else
      throw new Error('Failed to fetch payment intent details.');
  }
};

export const cancelPayment = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
  return paymentIntent;
};

export const createRefunds = async (
  paymentIntentId: string,
  amount: number | undefined
): Promise<Stripe.Refund> => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount
  });
  return refund;
};

