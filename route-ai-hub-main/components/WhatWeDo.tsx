'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Search, BarChart3, FileText, Activity } from 'lucide-react';

const solutions = [
  {
    icon: CheckCircle,
    title: 'Verifies Identity',
    description: 'Automatically validates patient identifiers and ensures compatibility with existing systems.',
  },
  {
    icon: Search,
    title: 'Classifies Requests',
    description: 'Uses advanced AI to understand request intent and categorize appropriately.',
  },
  {
    icon: BarChart3,
    title: 'Scores Facilities',
    description: 'Evaluates multiple factors to find the best routing destination.',
  },
  {
    icon: FileText,
    title: 'Explains Decisions',
    description: 'Provides clear reasoning for every routing decision made.',
  },
  {
    icon: Activity,
    title: 'Logs Everything',
    description: 'Comprehensive audit trail for compliance and continuous improvement.',
  },
];

export default function WhatWeDo() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-900/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How Handoff Helps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform transforms request routing from a manual process into an intelligent, automated system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 card-gradient">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <solution.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {solution.description}
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