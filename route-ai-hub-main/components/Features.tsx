'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Eye, 
  Building2, 
  FileText, 
  Activity, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'LLM Classification',
    description: 'Advanced language models classify requests with high accuracy and guardrails.',
  },
  {
    icon: Eye,
    title: 'Explainable Decisions',
    description: 'Every routing decision includes clear explanations for clinical staff.',
  },
  {
    icon: Building2,
    title: 'Facility Scoring',
    description: 'Multi-factor scoring based on capability, proximity, and capacity.',
  },
  {
    icon: FileText,
    title: 'FHIR Adapter',
    description: 'Seamless integration with FHIR R4 ServiceRequest standards.',
  },
  {
    icon: Activity,
    title: 'Real-time Feed',
    description: 'Live event streaming with Server-Sent Events for instant updates.',
  },
  {
    icon: Shield,
    title: 'SLA/Retry/Idempotency',
    description: 'Enterprise-grade reliability with automatic retries and idempotent requests.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline request routing and reduce manual overhead.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 card-gradient">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}