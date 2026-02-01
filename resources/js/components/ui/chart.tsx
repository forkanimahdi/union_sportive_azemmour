'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ChartConfig = Record<
  string,
  { label?: string; color?: string; icon?: React.ComponentType<{ className?: string }> }
>;

const ChartContext = React.createContext<{ config: ChartConfig }>({ config: {} });

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn('w-full', className)}>{children}</div>
    </ChartContext.Provider>
  );
}

export function useChartConfig() {
  return React.useContext(ChartContext).config;
}
