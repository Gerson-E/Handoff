'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for development and testing',
    price: 'Free',
    period: 'forever',
    features: [
      'Development sandbox environment',
      'Real-time dashboard access',
      'Server-Sent Events streaming',
      'Single environment',
      '1,000 requests per month',
      'Basic support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For growing healthcare organizations',
    price: '$299',
    period: 'per month',
    features: [
      'Everything in Starter',
      'Single Sign-On (SSO)',
      'Comprehensive audit trails',
      'Custom scoring weights',
      'Multiple environments',
      '100,000 requests per month',
      'Priority support',
      'SLA guarantees',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large healthcare systems',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Everything in Pro',
      'High availability cluster',
      'PHI-safe deployments',
      'SOC2 Type II compliance',
      'Custom SLAs',
      'Unlimited requests',
      'Dedicated support',
      'On-premise options',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PlansPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with our free tier and scale as your needs grow. All plans include our core AI routing capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Need a custom solution? We're here to help.
            </p>
            <Button variant="outline" size="lg">
              Contact Sales Team
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
