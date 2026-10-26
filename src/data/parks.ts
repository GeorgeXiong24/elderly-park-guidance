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
import yanhanShanCover from '@/assets/parks/yanhan-shan/cover.png';
import xiwanHongshulinCover from '@/assets/parks/xiwan-hongshulin/cover.jpg';
import lizhiCover from '@/assets/parks/lizhi/cover.jpg';
import baoanCover from '@/assets/parks/baoan/cover.jpg';
import julongShanCover from '@/assets/parks/julong-shan/cover.png';
import pingshanHeCover from '@/assets/parks/pingshan-he/cover.png';
import pingshanZhongxinCover from '@/assets/parks/pingshan-zhongxin/cover.png';
import yanziLingCover from '@/assets/parks/yanzi-ling/cover.png';
import yueliangWanCover from '@/assets/parks/yueliang-wan/cover.png';

export const PARKS: Park[] = [
  {
    id: 'shenzhen-wan',
    name: '深圳湾公园',
    rating: 4.1,
    features: ['无障碍通行', '休息座椅多', '地铁可达', '园内接驳车', '水景栈道', '可租借轮椅'],
    region: '福田区/南山区',
    imageUrl: shenzhenWanCover,
  },
  {
    id: 'wutong-shan',
    name: '梧桐山风景名胜区',
    rating: 2.8,
    features: ['步道平缓', '林荫遮阴好', '地铁可达', '园内接驳车', '观景平台多'],
    region: '罗湖区/盐田区/龙岗区',
    imageUrl: wutongShanCover,
  },
  {
    id: 'lianhua-shan',
    name: '莲花山公园',
    rating: 4.0,
    features: ['无障碍通行', '休息座椅多', '健身器材多', '地铁可达', '园内接驳车'],
    region: '福田区',
    imageUrl: lianhuaShanCover,
  },
  {
    id: 'xianhu',
    name: '仙湖植物园',
    rating: 3.2,
    features: ['步道平缓', '清幽人少', '园内接驳车', '水景栈道', '可租借轮椅'],
    region: '罗湖区',
    imageUrl: xianhuCover,
  },
  {
    id: 'bijia-shan',
    name: '笔架山体育公园',
    rating: 4.2,
    features: ['步道平缓', '林荫遮阴好', '健身器材多', '地铁可达', '无障碍卫生间'],
    region: '福田区',
    imageUrl: bijiaShanCover,
  },
  {
    id: 'yuanboyuan',
    name: '园博园',
    rating: 3.7,
    features: ['凉亭廊架多', '林荫遮阴好', '清幽人少', '地铁可达', '园内接驳车', '水景栈道', '免费开放'],
    region: '福田区',
    imageUrl: yuanboyuanCover,
  },
  {
    id: 'shenzhen-rencai',
    name: '深圳人才公园',
    rating: 3.9,
    features: ['无障碍通行', '步道平缓', '健身器材多', '地铁可达', '无障碍卫生间', '水景栈道'],
    region: '南山区',
    imageUrl: shenzhenRencaiCover,
  },
  {
    id: 'dasha-he',
    name: '大沙河公园',
    rating: 4.0,
    features: ['无障碍通行', '休息座椅多', '凉亭廊架多', '健身器材多', '无障碍卫生间', '水景栈道'],
    region: '南山区',
    imageUrl: dashaHeCover,
  },
  {
    id: 'dameisha',
    name: '大梅沙海滨公园',
    rating: 3.5,
    features: ['无障碍通行', '水景栈道', '观景平台多', '免费开放'],
    region: '盐田区',
    imageUrl: dameishaCover,
  },
  {
    id: 'baoan-binhai',
    name: '宝安滨海文化公园',
    rating: 3.9,
    features: ['无障碍通行', '地铁可达', '无障碍卫生间', '水景栈道'],
    region: '宝安区',
    imageUrl: baoanBinhaiCover,
  },
  {
    id: 'donghu',
    name: '东湖公园',
    rating: 3.7,
    features: ['步道平缓', '休息座椅多', '健身器材多', '适合晨练', '清幽人少', '水景栈道'],
    region: '罗湖区',
    imageUrl: donghuCover,
  },
  {
    id: 'honghu',
    name: '洪湖公园',
    rating: 3.6,
    features: ['无障碍通行', '步道平缓', '休息座椅多', '健身器材多', '地铁可达', '水景栈道'],
    region: '罗湖区',
    imageUrl: honghuCover,
  },
  {
    id: 'yangtai-shan',
    name: '阳台山森林公园',
    rating: 3.1,
    features: ['步道平缓', '凉亭廊架多', '林荫遮阴好', '地铁可达', '观景平台多'],
    region: '宝安区/龙华区/南山区',
    imageUrl: yangtaiShanCover,
  },
  {
    id: 'fenghuang-shan',
    name: '凤凰山森林公园',
    rating: 3.0,
    features: ['步道平缓', '林荫遮阴好', '观景平台多', '免费开放'],
    region: '宝安区',
    imageUrl: fenghuangShanCover,
  },
  {
    id: 'shenzhen-zhongxin',
    name: '深圳中心公园',
    rating: 3.9,
    features: ['无障碍通行', '林荫遮阴好', '健身器材多', '地铁可达', '无障碍卫生间'],
    region: '福田区',
    imageUrl: shenzhenZhongxinCover,
  },
  {
    id: 'maluan-shan',
    name: '马峦山郊野公园',
    rating: 2.6,
    features: ['步道平缓', '凉亭廊架多', '林荫遮阴好', '地铁可达'],
    region: '坪山区',
    imageUrl: maluanShanCover,
  },
  {
    id: 'tanglang-shan',
    name: '塘朗山郊野公园',
    rating: 3.1,
    features: ['步道平缓', '凉亭廊架多', '林荫遮阴好', '地铁可达', '观景平台多'],
    region: '南山区',
    imageUrl: tanglangShanCover,
  },
  {
    id: 'yanhan-shan',
    name: '燕晗山公园',
    rating: 2.8,
    features: ['步道平缓', '林荫遮阴好', '清幽人少', '地铁可达', '水景栈道', '免费开放'],
    region: '南山区',
    imageUrl: yanhanShanCover,
  },
  {
    id: 'xiwan-hongshulin',
    name: '西湾红树林公园',
    rating: 3.2,
    features: ['无障碍通行', '水景栈道', '观景平台多'],
    region: '宝安区',
    imageUrl: xiwanHongshulinCover,
  },
  {
    id: 'lizhi',
    name: '荔枝公园',
    rating: 3.6,
    features: ['步道平缓', '休息座椅多', '林荫遮阴好', '健身器材多', '适合晨练', '地铁可达'],
    region: '福田区',
    imageUrl: lizhiCover,
  },
  {
    id: 'baoan',
    name: '宝安公园',
    rating: 3.6,
    features: ['无障碍通行', '步道平缓', '凉亭廊架多', '林荫遮阴好', '地铁可达'],
    region: '宝安区',
    imageUrl: baoanCover,
  },
  {
    id: 'julong-shan',
    name: '聚龙山公园',
    rating: 4.1,
    features: ['无障碍通行', '步道平缓', '林荫遮阴好', '适合晨练', '清幽人少'],
    region: '坪山区',
    imageUrl: julongShanCover,
  },
  {
    id: 'pingshan-he',
    name: '坪山河湿地公园',
    rating: 3.6,
    features: ['步道平缓', '休息座椅多', '清幽人少', '水景栈道', '观景平台多', '免费开放'],
    region: '坪山区',
    imageUrl: pingshanHeCover,
  },
  {
    id: 'pingshan-zhongxin',
    name: '坪山中心公园',
    rating: 4.5,
    features: ['无障碍通行', '休息座椅多', '健身器材多', '地铁可达', '水景栈道', '无障碍卫生间', '凉亭廊架多', '适合晨练', '免费开放'],
    region: '坪山区',
    imageUrl: pingshanZhongxinCover,
  },
  {
    id: 'yanzi-ling',
    name: '燕子岭公园',
    rating: 3.1,
    features: ['步道平缓', '林荫遮阴好', '凉亭廊架多', '清幽人少', '水景栈道', '观景平台多', '免费开放', '地铁可达', '适合晨练'],
    region: '坪山区',
    imageUrl: yanziLingCover,
  },
  {
    id: 'yueliang-wan',
    name: '月亮湾公园',
    rating: 4.3,
    features: ['地铁可达', '林荫遮阴好', '水景栈道', '步道平缓', '健身器材多', '凉亭廊架多', '免费开放', '休息座椅多', '适合晨练', '可租借轮椅', '园内接驳车'],
    region: '南山区',
    imageUrl: yueliangWanCover,
  },
];

export const FILTER_TAGS = [
  { id: 'all', name: '全部公园' },
  { id: '无障碍通行', name: '无障碍通行' },
  { id: '无障碍卫生间', name: '无障碍卫生间' },
  { id: '可租借轮椅', name: '可租借轮椅' },
  { id: '步道平缓', name: '步道平缓' },
  { id: '休息座椅多', name: '休息座椅多' },
  { id: '凉亭廊架多', name: '凉亭廊架多' },
  { id: '林荫遮阴好', name: '林荫遮阴好' },
  { id: '健身器材多', name: '健身器材多' },
  { id: '地铁可达', name: '地铁可达' },
  { id: '园内接驳车', name: '园内接驳车' },
  { id: '水景栈道', name: '水景栈道' },
  { id: '观景平台多', name: '观景平台多' },
  { id: '清幽人少', name: '清幽人少' },
  { id: '适合晨练', name: '适合晨练' },
  { id: '免费开放', name: '免费开放' },
];
