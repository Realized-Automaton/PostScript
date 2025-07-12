
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Feather, Lock, Star, ArrowLeft } from 'lucide-react';
import Header from '@/components/app/Header';
import Footer from '@/components/app/Footer';

const plans = [
  {
    name: 'Free Tier',
    price: '$0/month',
    icon: <Feather className="w-8 h-8 text-primary-foreground" />,
    features: ['5 chats per day', '1 AI persona', 'Text-only interaction'],
    cta: 'Current Plan',
    current: true,
  },
  {
    name: 'Plus Tier',
    price: '$10/month',
    icon: <Lock className="w-8 h-8 text-primary" />,
    features: [
      '20 chats per day',
      'Up to 3 AI personas',
      'Save & resume conversations',
      'Upload 30-60s voice clip for voice cloning',
      'Text-to-voice playback',
    ],
    cta: 'Upgrade to Plus',
    current: false,
  },
  {
    name: 'Premium Tier',
    price: '$25/month',
    icon: <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />,
    features: [
      'Unlimited chats',
      'Unlimited personas',
      'More daily voice responses',
      'Priority support',
      'Exclusive access to upcoming avatar video feature',
    ],
    cta: 'Upgrade to Premium',
    current: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-foreground">Tiered Plans Designed for Emotional Connection</h1>
            <p className="text-xl text-primary/90 mt-4 max-w-2xl mx-auto">
              Start with memory. Upgrade to voice. Bring them to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`flex flex-col shadow-xl border-2 border-primary`}>
                <CardHeader className="items-center">
                  {plan.icon}
                  <CardTitle className="text-2xl font-headline mt-4">{plan.name}</CardTitle>
                  <CardDescription className="text-lg">{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={plan.current}>
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
