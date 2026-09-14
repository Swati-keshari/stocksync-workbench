"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useUiStore } from "@/stores/useUiStore";
import type { SyncHealth } from "@/lib/types";

export function SyncActivityChart({ activity }: { activity: SyncHealth["activity"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const theme = useUiStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chartRef.current = chart;

    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !mounted) return;

    const isDark = theme === "dark";
    const textSecondary = isDark ? "#94a3b8" : "#64748b";
    const gridLine = isDark ? "#27324a" : "#e2e8f0";

    chartRef.current.setOption({
      backgroundColor: "transparent",
      textStyle: { fontFamily: "inherit", color: textSecondary },
      grid: { left: 40, right: 16, top: 36, bottom: 28 },
      legend: {
        top: 0,
        left: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: textSecondary, fontSize: 12 },
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: activity.labels,
        axisLine: { lineStyle: { color: gridLine } },
        axisLabel: { color: textSecondary, fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: gridLine } },
        axisLabel: { color: textSecondary, fontSize: 11 },
      },
      series: activity.series.map((s, i) => ({
        name: s.name,
        type: "line",
        data: s.data,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 2, color: i === 0 ? "#3b82f6" : "#f59e0b" },
        itemStyle: { color: i === 0 ? "#3b82f6" : "#f59e0b" },
        areaStyle:
          i === 0
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(59,130,246,0.18)" },
                  { offset: 1, color: "rgba(59,130,246,0)" },
                ]),
              }
            : undefined,
      })),
    });
  }, [activity, theme, mounted]);

  return <div ref={ref} className="h-64 w-full" />;
}
