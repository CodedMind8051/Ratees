import { useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { RATING_ORDER , RATING_LABELS, RATING_COLORS } from '@/constants/rating.constant';
import {RatingKey} from "@/types/rating.types"

interface Props {
  distribution: Record<RatingKey, number>;
}


const HIDDEN_MAX_ENTRY = {
  name: '',
  value: 100,
  fill: 'transparent',
};

export default function RatingDistributionChart({ distribution }: Props) {
  const data = useMemo(
    () =>
      RATING_ORDER.map(key => ({
        name: RATING_LABELS[key],
        value: distribution[key] ?? 0,
        fill: RATING_COLORS[key],
      })),
    [distribution]
  );

  const chartData = [...data, HIDDEN_MAX_ENTRY];

  const topRating = useMemo(() => {
    const nonZero = data.filter(d => d.value > 0);
    if (nonZero.length === 0) return null;
    return nonZero.reduce((prev, cur) => (cur.value > prev.value ? cur : prev));
  }, [data]);

  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <div
      className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 select-none shrink-0"
      role="img"
      aria-label={
        topRating
          ? `Rating distribution chart. Top rating: ${topRating.name} at ${topRating.value}%`
          : 'Rating distribution chart. No ratings yet.'
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="98%"
          barSize={7}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: 'hsl(var(--secondary) / 0.25)' }}
            animationDuration={reducedMotion ? 0 : 800}
            animationEasing="ease-out"
          />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              if (!item.name) return null;
              return (
                <div className="bg-card/95 border border-border rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md pointer-events-none">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: item.fill }}
                  >
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

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {topRating ? (
          <>
            <span
              className="text-lg sm:text-xl font-black tabular-nums leading-none"
              style={{ color: topRating.fill }}
            >
              {topRating.value}%
            </span>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground/60 font-semibold uppercase tracking-wider mt-0.5 leading-none text-center px-1 truncate max-w-full">
              {topRating.name}
            </span>
          </>
        ) : (
          <span className="text-[9px] text-muted-foreground/50 font-semibold uppercase tracking-wider text-center px-2 leading-tight">
            No ratings
          </span>
        )}
      </div>
    </div>
  );
}