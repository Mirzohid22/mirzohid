import type { Metadata } from "next";
import Header from "@/components/header";
import EventLoopVisualizer from "./EventLoopVisualizer";

export const metadata: Metadata = {
  title: "Event Loop Visualizer",
  description:
    "Interactive step-by-step visualization of JavaScript's event loop — call stack, web APIs, microtask queue, and macro task queue.",
};

export default function EventLoopPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <EventLoopVisualizer />
    </main>
  );
}
