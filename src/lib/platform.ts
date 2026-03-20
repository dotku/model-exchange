/** Platform fee rate: 15% of transaction value */
export const PLATFORM_FEE_RATE = 0.15;

/** Provider revenue share: 85% */
export const PROVIDER_REVENUE_RATE = 1 - PLATFORM_FEE_RATE;

export type BillingType = "platform" | "external";

/**
 * Calculate the fee breakdown for a given price
 */
export function calculateFees(price: number) {
  const platformFee = Math.round(price * PLATFORM_FEE_RATE * 100) / 100;
  const providerRevenue = Math.round(price * PROVIDER_REVENUE_RATE * 100) / 100;
  return { platformFee, providerRevenue, total: price };
}
