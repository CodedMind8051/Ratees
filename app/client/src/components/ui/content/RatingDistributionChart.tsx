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

  const average = useMemo(() => {
    const ws = distribution.waste ?? 0;
    const tp = distribution.timepass ?? 0;
    const gd = distribution.good ?? 0;
    const mp = distribution.masterpiece ?? 0;
    const total = ws + tp + gd + mp;
    if (total === 0) return null;
    return ((mp * 4 + gd * 3 + tp * 2 + ws * 1) / total).toFixed(1);
  }, [distribution]);

  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <div
      className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 select-none shrink-0"
      role="img"
      aria-label={
        average
          ? `Rating distribution chart. Average rating: ${average} out of 4`
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
        {average ? (
          <>
            <span className="text-lg sm:text-xl font-black tabular-nums leading-none text-foreground">
              {average}
            </span>
            <span className="text-[9px] text-muted-foreground/50 font-semibold tracking-wider mt-0.5 leading-none">
              / 4
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