import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

export async function checkSubscription(email: string): Promise<boolean> {
  try {
    // Search for customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return false
    }

    const customer = customers.data[0]

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    })

    return subscriptions.data.length > 0
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}
