'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Shield, Rocket, Sparkles } from 'lucide-react';

export default function PricingDemo() {
  const [paddleReady, setPaddleReady] = useState(false);

  useEffect(() => {
    // Load Paddle.js
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).Paddle) {
        // Set environment to sandbox for testing
        (window as any).Paddle.Environment.set('sandbox');
        
        // Initialize Paddle with client token
        (window as any).Paddle.Initialize({
          token: 'test_f82306e114f916062de3c0725ef',
          // For production, add pwCustomer for Retain integration
          // pwCustomer: 'customer-email@example.com',
          eventCallback: (event: any) => {
            console.log('Paddle event:', event);
            if (event.name === 'checkout.completed') {
              console.log('Payment successful!', event.data);
              alert('Payment successful! Thank you for subscribing.');
            }
          }
        });
        setPaddleReady(true);
        console.log('Paddle initialized successfully');
      }
    };
    script.onerror = () => {
      console.error('Failed to load Paddle.js');
      alert('Payment system failed to load. Please refresh the page.');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.remove();
      }
    };
  }, []);

  const handleSubscribe = (priceId: string, planName: string) => {
    if (!paddleReady) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    if (!priceId) {
      alert('Product configuration error. Please contact support.');
      return;
    }

    try {
      console.log('Opening Paddle checkout for:', { priceId, planName });
      
      (window as any).Paddle.Checkout.open({
        items: [{ 
          priceId: priceId, 
          quantity: 1 
        }],
        customData: {
          planName: planName,
          userId: 'demo-user-' + Date.now(),
          source: 'OrbitEdge Dashboard'
        },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          allowLogout: false,
          showAddDiscounts: true,
          showAddTaxId: true,
        },
        customer: {
          email: 'demo@orbitedge.com' // Pre-fill for testing
        },
        successCallback: (data: any) => {
          console.log('Checkout success:', data);
          alert(`🎉 Subscription activated! Welcome to ${planName} plan.`);
        },
        closeCallback: (data: any) => {
          console.log('Checkout closed:', data);
        }
      });
    } catch (error) {
      console.error('Paddle checkout error:', error);
      alert('Failed to open checkout. Please try again or contact support.');
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for small satellite operators',
      features: [
        'Up to 3 satellites',
        'Basic real-time tracking',
        'Collision warnings',
        'Email support',
        'Basic analytics',
      ],
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'For growing satellite fleets',
      features: [
        'Up to 10 satellites',
        'Advanced tracking & predictions',
        'AI-powered maneuver optimization',
        'Priority support',
        'Advanced analytics & reports',
        'Ground station booking',
        'API access',
      ],
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$499',
      period: '/month',
      description: 'For large-scale operations',
      features: [
        'Unlimited satellites',
        'Full feature access',
        '24/7 dedicated support',
        'Custom integrations',
        'Compliance automation',
        'Multi-user accounts',
        'White-label options',
        'SLA guarantees',
      ],
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Paddle Payments
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start managing your satellite fleet with OrbitEdge. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Payment Status */}
        <div className="mb-8">
          {paddleReady ? (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center">
              <p className="text-green-800 font-medium flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                ✅ Payment system ready! Click any plan to test Paddle checkout.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl text-center">
              <p className="text-amber-800 font-medium flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                ⏳ Loading Paddle payment system...
              </p>
            </div>
          )}
          
          {/* Debug Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
            <p className="text-blue-800 mb-1"><strong>Debug Info:</strong></p>
            <p className="text-blue-700">Vendor ID: 42964</p>
            <p className="text-blue-700">Environment: Sandbox</p>
            <p className="text-blue-700">Price ID: pri_01kbxy71hvqced5x6cghdsa23n</p>
            <p className="text-blue-700">Paddle Status: {paddleReady ? '✅ Loaded' : '⏳ Loading...'}</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? 'border-purple-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-xs font-bold rounded-bl-xl shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <CardHeader className="pb-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 text-lg">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={() =>
                    handleSubscribe('pri_01kbxy71hvqced5x6cghdsa23n', plan.name)
                  }
                  className={`w-full mb-6 h-12 text-base font-semibold bg-gradient-to-r ${plan.color} hover:opacity-90 text-white shadow-lg transition-all hover:shadow-xl`}
                  disabled={!paddleReady}
                >
                  {paddleReady ? 'Start Free Trial' : 'Loading...'}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Card Info */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              🧪 Test Mode - Use Test Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Card Number</p>
                <p className="text-lg font-mono font-bold text-gray-900">4242 4242 4242 4242</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                <p className="text-lg font-mono font-bold text-gray-900">12/25</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">CVC</p>
                <p className="text-lg font-mono font-bold text-gray-900">123</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-center">
              This is a sandbox environment. Use the test card above for demo payments.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-sm text-gray-600">
              PCI-DSS compliant with Paddle
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">14-Day Free Trial</h3>
            <p className="text-sm text-gray-600">
              No credit card required to start
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
            <p className="text-sm text-gray-600">
              No long-term commitments
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Setup</h3>
            <p className="text-sm text-gray-600">
              Get started in minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
