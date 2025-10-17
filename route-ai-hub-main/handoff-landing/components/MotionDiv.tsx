"use client";
import { motion, type HTMLMotionProps } from "framer-motion";

export default function MotionDiv(props: HTMLMotionProps<"div">) {
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return <div {...props} /> as any;
  return <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, ease: "easeOut" }} {...props} />;
}


