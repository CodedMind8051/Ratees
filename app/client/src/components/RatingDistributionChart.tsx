'use client';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { RatingKey, RATING_LABELS, RATING_COLORS } from '@/data/mockData';

interface Props {
  distribution: Record<RatingKey, number>;
}

const RATING_ORDER: RatingKey[] = ['masterpiece', 'good', 'timepass', 'waste'];

export default function RatingDistributionChart({ distribution }: Props) {
  const data = RATING_ORDER.map(key => {
    console.log(key)
    return {
      name: RATING_LABELS[key],
      value: distribution[key],
      fill: RATING_COLORS[key],
    }
  });

  const topRating = data.reduce((prev, cur) =>
    cur.value > prev.value ? cur : prev, data[0]
  );

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 select-none shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="32%"
          outerRadius="100%"
          barSize={8}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: 'hsl(var(--secondary) / 0.25)' }}
            animationDuration={900}
            animationEasing="ease-out"
          />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="bg-card/95 border border-border rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md pointer-events-none z-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: item.fill }}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                    {item.value}%
                  </p>
                </div>
              );
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Centre: top rating % */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="text-xl font-black tabular-nums leading-none"
          style={{ color: topRating.fill }}
        >
          {topRating.value}%
        </span>
        <span className="text-[9px] text-muted-foreground/60 font-semibold uppercase tracking-wider mt-0.5 leading-none">
          top
        </span>
      </div>
    </div>
  );
}