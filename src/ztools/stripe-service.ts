import options from "./config";
import Stripe from "stripe";
import { Request, Response } from "express";
import { modifyBooking } from "../booking/infrastructure/dependencies";

if(!options.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is not defined. Add it to your .env file');
}

const stripe = new Stripe(options.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
});

export const createPaymentIntent = async(
  amount: number,
  currency: string,
  description: string,
  bookingId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      metadata: {
        bookingId: bookingId
      },
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

//Webhooks
const WEBHOOK_SECRET = options.STRIPE_WEBHOOK_SECRET;

export const webhookController = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  try {
    const event: Stripe.Event = stripe.webhooks.constructEvent(req.body as Buffer, signature, WEBHOOK_SECRET);

    console.log(`✅ Received event: ${event.type}`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);

        await modifyBooking.runWebhook(paymentIntent.metadata.bookingId, 'paid');
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        console.log(`❌ PaymentIntent canceled: ${paymentIntent.id}`);

        await modifyBooking.runWebhook(paymentIntent.metadata.bookingId, 'canceled');
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        console.log(`💸 Refund issued for paymentIntent: ${charge.payment_intent}`);

        await modifyBooking.runWebhook(charge.metadata.bookingId, 'refunded');
        break;
      }

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
};

