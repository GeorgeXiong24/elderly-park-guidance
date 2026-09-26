import type { Park } from '@/types/park';
import shenzhenWanCover from '@/assets/parks/shenzhen-wan/cover.jpg';
import wutongShanCover from '@/assets/parks/wutong-shan/cover.jpg';
import lianhuaShanCover from '@/assets/parks/lianhua-shan/cover.jpeg';
import xianhuCover from '@/assets/parks/xianhu/cover.jpg';
import bijiaShanCover from '@/assets/parks/bijia-shan/cover.jpeg';
import yuanboyuanCover from '@/assets/parks/yuanboyuan/cover.jpg';
import shenzhenRencaiCover from '@/assets/parks/shenzhen-rencai/cover.jpg';
import dashaHeCover from '@/assets/parks/dasha-he/cover.png';
import dameishaCover from '@/assets/parks/dameisha/cover.jpg';
import baoanBinhaiCover from '@/assets/parks/baoan-binhai/cover.jpg';
import donghuCover from '@/assets/parks/donghu/cover.jpg';
import honghuCover from '@/assets/parks/honghu/cover.jpg';
import yangtaiShanCover from '@/assets/parks/yangtai-shan/cover.png';
import fenghuangShanCover from '@/assets/parks/fenghuang-shan/cover.jpg';
import shenzhenZhongxinCover from '@/assets/parks/shenzhen-zhongxin/cover.jpg';
import maluanShanCover from '@/assets/parks/maluan-shan/cover.jpg';
import tanglangShanCover from '@/assets/parks/tanglang-shan/cover.jpg';
import xiwanHongshulinCover from '@/assets/parks/xiwan-hongshulin/cover.jpg';
import lizhiCover from '@/assets/parks/lizhi/cover.jpg';
import baoanCover from '@/assets/parks/baoan/cover.jpg';

const COMMON_FEATURES = ['座椅多', '无障碍友好', '适合散步'];

export const PARKS: Park[] = [
  {
    id: 'shenzhen-wan',
    name: '深圳湾公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '福田区/南山区',
    imageUrl: shenzhenWanCover,
  },
  {
    id: 'wutong-shan',
    name: '梧桐山风景名胜区',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '罗湖区/盐田区/龙岗区',
    imageUrl: wutongShanCover,
  },
  {
    id: 'lianhua-shan',
    name: '莲花山公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '福田区',
    imageUrl: lianhuaShanCover,
  },
  {
    id: 'xianhu',
    name: '仙湖植物园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '罗湖区',
    imageUrl: xianhuCover,
  },
  {
    id: 'bijia-shan',
    name: '笔架山体育公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '福田区',
    imageUrl: bijiaShanCover,
  },
  {
    id: 'yuanboyuan',
    name: '园博园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '福田区',
    imageUrl: yuanboyuanCover,
  },
  {
    id: 'shenzhen-rencai',
    name: '深圳人才公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '南山区',
    imageUrl: shenzhenRencaiCover,
  },
  {
    id: 'dasha-he',
    name: '大沙河公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '南山区',
    imageUrl: dashaHeCover,
  },
  {
    id: 'dameisha',
    name: '大梅沙海滨公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '盐田区',
    imageUrl: dameishaCover,
  },
  {
    id: 'baoan-binhai',
    name: '宝安滨海文化公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '宝安区',
    imageUrl: baoanBinhaiCover,
  },
  {
    id: 'donghu',
    name: '东湖公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '罗湖区',
    imageUrl: donghuCover,
  },
  {
    id: 'honghu',
    name: '洪湖公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '罗湖区',
    imageUrl: honghuCover,
  },
  {
    id: 'yangtai-shan',
    name: '阳台山森林公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '宝安区/龙华区/南山区',
    imageUrl: yangtaiShanCover,
  },
  {
    id: 'fenghuang-shan',
    name: '凤凰山森林公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '宝安区',
    imageUrl: fenghuangShanCover,
  },
  {
    id: 'shenzhen-zhongxin',
    name: '深圳中心公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '福田区',
    imageUrl: shenzhenZhongxinCover,
  },
  {
    id: 'maluan-shan',
    name: '马峦山郊野公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '坪山区',
    imageUrl: maluanShanCover,
  },
  {
    id: 'tanglang-shan',
    name: '塘朗山郊野公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '南山区',
    imageUrl: tanglangShanCover,
  },
  {
    id: 'xiwan-hongshulin',
    name: '西湾红树林公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '宝安区',
    imageUrl: xiwanHongshulinCover,
  },
  {
    id: 'lizhi',
    name: '荔枝公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '福田区',
    imageUrl: lizhiCover,
  },
  {
    id: 'baoan',
    name: '宝安公园',
    rating: 4.8,
    features: COMMON_FEATURES,
    region: '宝安区',
    imageUrl: baoanCover,
  },
];

export const FILTER_TAGS = [
  { id: 'all', name: '全部公园' },
  { id: 'accessible', name: '无障碍通道' },
  { id: 'seats', name: '休息座椅多' },
  { id: 'pavilion', name: '遮阳凉亭' },
  { id: 'fitness', name: '老年健身器材' },
  { id: 'quiet', name: '安静散步' },
];
