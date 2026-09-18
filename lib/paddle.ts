// Paddle Payment Integration for OrbitEdge

interface PaddleConfig {
  vendorId: string;
  clientToken: string;
  environment: 'sandbox' | 'production';
}

// Paddle Configuration
// TODO: Replace these with your actual Paddle credentials from https://sandbox-vendors.paddle.com/
export const paddleConfig: PaddleConfig = {
  vendorId: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '', // Get from Paddle Dashboard → Developer Tools → Authentication
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '', // Client-side token for Paddle.js
  environment: 'sandbox', // Use 'sandbox' for testing, 'production' for live
};

// Paddle Product/Price IDs
// TODO: Create products in Paddle Dashboard and add their IDs here
export const paddleProducts = {
  // Subscription Plans
  starter: {
    name: 'Starter Plan',
    priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || '',
    features: ['Up to 3 satellites', 'Basic tracking', 'Email support'],
  },
  professional: {
    name: 'Professional Plan',
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '',
    features: ['Up to 10 satellites', 'Advanced tracking', 'Priority support', 'AI predictions'],
  },
  enterprise: {
    name: 'Enterprise Plan',
    priceId: process.env.NEXT_PUBLIC_PADDLE_ENTERPRISE_PRICE_ID || '',
    features: ['Unlimited satellites', 'Full feature access', '24/7 support', 'Custom integrations'],
  },
  
  // One-time purchases
  groundStationBooking: {
    name: 'Ground Station Booking',
    priceId: process.env.NEXT_PUBLIC_PADDLE_GROUND_STATION_PRICE_ID || '',
  },
  debrisAnalysis: {
    name: 'Debris Risk Analysis',
    priceId: process.env.NEXT_PUBLIC_PADDLE_DEBRIS_ANALYSIS_PRICE_ID || '',
  },
};

// Initialize Paddle.js
export const initializePaddle = () => {
  if (typeof window === 'undefined') return;

  // Load Paddle.js script
  const script = document.createElement('script');
  script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  script.async = true;
  script.onload = () => {
    if ((window as any).Paddle) {
      // Set environment (sandbox or production)
      (window as any).Paddle.Environment.set(paddleConfig.environment);
      
      // Initialize Paddle
      (window as any).Paddle.Initialize({
        token: paddleConfig.clientToken,
        eventCallback: (event: any) => {
          console.log('Paddle Event:', event);
          
          // Handle different event types
          switch (event.name) {
            case 'checkout.loaded':
              console.log('Checkout loaded successfully');
              break;
            case 'checkout.completed':
              console.log('Payment completed:', event.data);
              break;
            case 'checkout.closed':
              console.log('Checkout closed');
              break;
            case 'checkout.error':
              console.error('Checkout error:', event.error);
              break;
          }
        }
      });
      
      console.log('Paddle initialized in', paddleConfig.environment, 'mode');
    }
  };
  script.onerror = () => {
    console.error('Failed to load Paddle.js');
  };
  document.head.appendChild(script);
};

// Open Paddle Checkout
export const openPaddleCheckout = (priceId: string, customData?: Record<string, any>) => {
  if (typeof window === 'undefined' || !(window as any).Paddle) {
    console.error('Paddle.js not loaded');
    return;
  }

  (window as any).Paddle.Checkout.open({
    items: [{ 
      priceId: priceId, 
      quantity: 1 
    }],
    customData: customData || {},
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      locale: 'en',
      allowLogout: false,
      showAddDiscounts: true,
    },
    successCallback: (data: any) => {
      console.log('Payment successful:', data);
      // Handle successful payment (e.g., update user subscription, show success message)
      if (typeof customData?.onSuccess === 'function') {
        customData.onSuccess(data);
      }
    },
    closeCallback: (data: any) => {
      console.log('Checkout closed:', data);
      if (typeof customData?.onClose === 'function') {
        customData.onClose(data);
      }
    },
  });
};

// Get subscription details
export const getSubscription = async (subscriptionId: string) => {
  // This would use Paddle's server-side API
  // You'll need to create an API route for this
  const response = await fetch(`/api/paddle/subscription/${subscriptionId}`);
  return response.json();
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  const response = await fetch(`/api/paddle/subscription/${subscriptionId}/cancel`, {
    method: 'POST',
  });
  return response.json();
};

// Webhook verification helper
export const verifyPaddleWebhook = (payload: string, signature: string, webhookSecret: string): boolean => {
  // Implement Paddle webhook signature verification
  // See: https://developer.paddle.com/webhooks/signature-verification
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');
  return calculatedSignature === signature;
};
