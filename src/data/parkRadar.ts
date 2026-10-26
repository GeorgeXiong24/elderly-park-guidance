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
  'lianhua-shan': [72, 80, 72, 85, 90],
  'xianhu': [48, 55, 52, 86, 75],
  'bijia-shan': [90, 85, 95, 76, 72],
  'yuanboyuan': [68, 75, 56, 84, 80],
  'shenzhen-rencai': [85, 68, 74, 82, 79],
  'dasha-he': [78, 78, 82, 85, 72],
  'dameisha': [70, 63, 62, 66, 82],
  'baoan-binhai': [88, 80, 60, 74, 90],
  'donghu': [72, 70, 70, 78, 78],
  'honghu': [75, 62, 60, 74, 90],
  'yangtai-shan': [45, 52, 63, 82, 66],
  'fenghuang-shan': [48, 58, 58, 76, 54],
  'shenzhen-zhongxin': [70, 70, 88, 78, 81],
  'maluan-shan': [42, 44, 52, 74, 44],
  'tanglang-shan': [46, 50, 64, 78, 70],
  'yanhan-shan': [46, 72, 50, 22, 70],
  'xiwan-hongshulin': [72, 58, 58, 80, 52],
  'lizhi': [62, 69, 70, 72, 86],
  'baoan': [58, 70, 78, 78, 78],
  'julong-shan': [86, 82, 68, 66, 92],
  'pingshan-he': [82, 76, 54, 48, 72],
  'pingshan-zhongxin': [98, 88, 100, 84, 74],
  'yanzi-ling': [26, 86, 76, 38, 92],
  'yueliang-wan': [90, 84, 98, 70, 85],
};

// 各公园加权总分（0-100 分），键为公园 id（与 parks.ts 中的 id 对应）
// 数据来源：evidence_list/radar_chart_data/park_radar_scores.xlsx 的「加权总分」列
export const PARK_WEIGHTED_SCORES: Record<string, number> = {
  'shenzhen-wan': 81,
  'wutong-shan': 56,
  'lianhua-shan': 80,
  'xianhu': 63,
  'bijia-shan': 84,
  'yuanboyuan': 73,
  'shenzhen-rencai': 78,
  'dasha-he': 79,
  'dameisha': 69,
  'baoan-binhai': 78,
  'donghu': 74,
  'honghu': 72,
  'yangtai-shan': 62,
  'fenghuang-shan': 59,
  'shenzhen-zhongxin': 77,
  'maluan-shan': 51,
  'tanglang-shan': 62,
  'xiwan-hongshulin': 64,
  'lizhi': 72,
  'baoan': 72,
  'yanhan-shan': 55,
  'julong-shan': 81,
  'pingshan-he': 71,
  'pingshan-zhongxin': 89,
  'yanzi-ling': 61,
  'yueliang-wan': 85,
};

export function getParkRadarScore(parkId: string): number[] | undefined {
  return PARK_RADAR_SCORES[parkId];
}

export function getParkWeightedScore(parkId: string): number | undefined {
  return PARK_WEIGHTED_SCORES[parkId];
}
