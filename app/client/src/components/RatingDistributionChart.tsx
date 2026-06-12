'use client';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import {
  RatingKey,
  RATING_LABELS,
  RATING_COLORS,
} from '@/data/mockData';

interface Props {
  distribution: Record<RatingKey, number>;
}

export default function RatingDistributionChart({
  distribution,
}: Props) {
  // Ordered from outer ring down to inner ring
  const data = [
    {
      name: RATING_LABELS.masterpiece,
      value: distribution.masterpiece,
      fill: RATING_COLORS.masterpiece,
    },
    {
      name: RATING_LABELS.good,
      value: distribution.good,
      fill: RATING_COLORS.good,
    },
    {
      name: RATING_LABELS.timepass,
      value: distribution.timepass,
      fill: RATING_COLORS.timepass,
    },
    {
      name: RATING_LABELS.waste,
      value: distribution.waste,
      fill: RATING_COLORS.waste,
    },
  ];

  const topRating = data.reduce((prev, current) =>
    current.value > prev.value ? current : prev,
    data[0]
  );

  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-12 gap-4 items-center select-none p-1">
      
      {/* Left Column: Radial Chart Matrix (Takes up 5/12 of space) */}
      <div className="sm:col-span-5 h-36 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="100%"
            barSize={7}
            startAngle={90}
            endAngle={-270}
            className="cursor-pointer"
          >
            <RadialBar
              dataKey="value"
              cornerRadius={12}
              background={{ fill: 'var(--secondary)', opacity: 0.12 }}
              animationDuration={800}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="bg-card/95 border border-border rounded-xl px-2.5 py-1.5 shadow-2xl backdrop-blur-md pointer-events-none z-50">
                    <p className="font-bold text-[10px] uppercase tracking-wide" style={{ color: item.fill }}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.value}% of users
                    </p>
                  </div>
                );
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Right Column: Dynamic Text Showcase & Clean Legend (Takes up 7/12 of space) */}
      <div className="sm:col-span-7 flex flex-col justify-center h-full pl-0 sm:pl-2">
        
        {/* Top Choice Highlights Panel Container */}
        <div className="mb-3 p-2.5 bg-secondary/30 border border-border/40 rounded-xl max-w-xs">
          <p className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            Community Choice
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span 
              className="text-2xl font-black tracking-tight"
              style={{ color: topRating.fill }}
            >
              {topRating.value}%
            </span>
            <span 
              className="text-xs font-bold uppercase tracking-wide truncate max-w-[120px]"
              style={{ color: topRating.fill }}
            >
              {topRating.name}
            </span>
          </div>
        </div>


      </div>
    </div>
  );
}