"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Trophy } from "lucide-react";

interface TimelineEvent {
  date: string;
  school: string;
  type: "offer" | "visit" | "commitment" | "camp";
}

interface RecruitingTimelineProps {
  events: TimelineEvent[];
}

const typeConfig = {
  offer: { color: "#00C2FF", icon: Trophy, label: "Offer" },
  visit: { color: "#C0C0C0", icon: MapPin, label: "Visit" },
  commitment: { color: "#00FF88", icon: Trophy, label: "Committed" },
  camp: { color: "#FFD700", icon: Calendar, label: "Camp" },
};

export default function RecruitingTimeline({ events }: RecruitingTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-uc-cyan/40 via-uc-cyan/10 to-transparent" />

      <div className="flex flex-col gap-6">
        {events.map((event, i) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-start gap-4 pl-1"
            >
              {/* Dot */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                style={{
                  background: `${config.color}20`,
                  border: `2px solid ${config.color}`,
                  boxShadow: `0 0 10px ${config.color}30`,
                }}
              >
                <Icon size={12} style={{ color: config.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 glass rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{event.school}</span>
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: config.color,
                      background: `${config.color}15`,
                    }}
                  >
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-uc-gray-400 mt-1">{event.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
