'use client';

import { motion } from 'framer-motion';

export default function SectionSeparator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex justify-center py-8"
    >
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
    </motion.div>
  );
}