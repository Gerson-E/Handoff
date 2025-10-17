'use client';

import { motion } from 'framer-motion';

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
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Who We Are
          </h2>
          <div className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Healthcare disparities affect not only rural regions but also small and resource-limited clinics that struggle to coordinate with larger hospitals. These systems often don't know where to send patient requests and records because identity data is disconnected across incompatible Electronic Health Records. <span className="font-bold text-blue-400">Handoff</span> solves this through an essential AI incorporation—leveraging verified patient identity, smart facility scoring, and explainable reasoning to automatically route every clinical order to the right destination the very first time. By eliminating data disconnection, duplication, and manual coordination, <span className="font-bold text-blue-400">Handoff</span> gives all clinics enterprise-grade intelligence and scalability, creating truly connected, equitable healthcare networks worldwide.
          </div>
        </motion.div>
      </div>
    </section>
  );
}