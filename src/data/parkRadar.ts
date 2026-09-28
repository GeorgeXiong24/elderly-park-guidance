// 适老性五维雷达图数据（0-100 分）
// 维度顺序与 RADAR_DIMENSIONS 保持一致

export interface RadarDimension {
  key: string;
  label: string;
}

export const RADAR_DIMENSIONS: RadarDimension[] = [
  { key: 'accessibility', label: '场地无障碍' },
  { key: 'safety', label: '安全与风险' },
  { key: 'facilities', label: '运动配套设施' },
  { key: 'comfort', label: '环境舒适度' },
  { key: 'transport', label: '交通便利性' },
];

// 各公园五维评分，键为公园 id（与 parks.ts 中的 id 对应）
// 数据来源：evidence_list/radar_chart_data/park_radar_scores.xlsx
export const PARK_RADAR_SCORES: Record<string, number[]> = {
  'shenzhen-wan': [86, 71, 78, 80, 88],
  'wutong-shan': [35, 42, 62, 83, 58],
};

export function getParkRadarScore(parkId: string): number[] | undefined {
  return PARK_RADAR_SCORES[parkId];
}
