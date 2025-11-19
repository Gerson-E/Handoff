'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, FileX, Phone } from 'lucide-react';

const issues = [
  {
    icon: AlertTriangle,
    title: 'Misrouted Requests',
    description: 'Requests sent to wrong departments or facilities, causing delays and patient frustration.',
  },
  {
    icon: FileX,
    title: 'Missing Identifiers',
    description: 'Incomplete patient information leading to failed routing attempts.',
  },
  {
    icon: Clock,
    title: 'Non-standard Formats',
    description: 'Inconsistent request formats requiring manual interpretation and processing.',
  },
  {
    icon: Phone,
    title: 'Staff Callbacks',
    description: 'Constant phone calls to clarify routing decisions, consuming valuable time.',
  },
];

export default function Issues() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Goes Wrong Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Common challenges in healthcare request routing that cost time and resources.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {issues.map((issue, index) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-destructive/20 hover:border-destructive/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                    <issue.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <CardTitle className="text-xl text-destructive">{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {issue.description}
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