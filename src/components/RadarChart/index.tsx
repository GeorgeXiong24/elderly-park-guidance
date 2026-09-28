import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { RADAR_DIMENSIONS } from '@/data/parkRadar';
import styles from './index.module.scss';

interface RadarChartProps {
  data: number[];
}

// 视觉常量
const PRIMARY = '#2e8b57';
const PRIMARY_LIGHT = '#3cb371';
const GRID_COLOR = 'rgba(46, 139, 87, 0.16)';
const GRID_OUTER_COLOR = 'rgba(46, 139, 87, 0.30)';
const AXIS_COLOR = 'rgba(46, 139, 87, 0.22)';
const ACTIVE_AXIS_COLOR = 'rgba(46, 139, 87, 0.70)';
// 半透明填充：既能看到色块，又能透出底层基准网格
const FILL_COLOR = 'rgba(46, 139, 87, 0.25)';
const LABEL_COLOR = '#5a665d';
const TEXT_SECONDARY = '#4a4a4a';
const CARD_BORDER = '#dfe8dd';
const RING_LEVELS = 5;

// 悬浮卡尺寸（CSS 像素）
const CARD_W = 112;
const CARD_H = 98;
const CARD_RADIUS = 9;

interface Point {
  x: number;
  y: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const canvasId = useMemo(() => `radar-${Math.random().toString(36).slice(2, 9)}`, []);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const ctxRef = useRef<any>(null);
  const sizeRef = useRef<number>(0);
  const activeRef = useRef<number | null>(null);
  const initedRef = useRef(false);

  const count = RADAR_DIMENSIONS.length;

  const avg = useMemo(
    () => Math.round(data.reduce((sum, value) => sum + value, 0) / data.length),
    [data]
  );

  // 几何计算（基于 CSS 像素）
  const getRadius = (w: number) => (w / 2) * (86 / 155);
  const vertexPoint = (index: number, radius: number, w: number): Point => {
    const angle = ((-90 + (index * 360) / count) * Math.PI) / 180;
    return {
      x: w / 2 + radius * Math.cos(angle),
      y: w / 2 + radius * Math.sin(angle),
    };
  };

  // 圆角矩形路径
  const roundedRect = (ctx: any, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // 在 Canvas 上直接绘制完全实心的悬浮评分卡
  const drawTooltip = (ctx: any, index: number, w: number) => {
    const radius = getRadius(w);
    const vertex = vertexPoint(index, (data[index] / 100) * radius, w);
    const below = vertex.y <= w * 0.45;

    const cx = Math.min(Math.max(vertex.x, CARD_W / 2 + 4), w - CARD_W / 2 - 4);
    const cardX = cx - CARD_W / 2;
    const cardY = below ? vertex.y + 12 : vertex.y - 12 - CARD_H;

    // 1) 实心白色底板（带投影）
    ctx.setShadow(0, 5, 16, 'rgba(0, 0, 0, 0.16)');
    roundedRect(ctx, cardX, cardY, CARD_W, CARD_H, CARD_RADIUS);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    ctx.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)');

    // 边框
    roundedRect(ctx, cardX, cardY, CARD_W, CARD_H, CARD_RADIUS);
    ctx.setStrokeStyle(CARD_BORDER);
    ctx.setLineWidth(1);
    ctx.stroke();

    // 2) 实心箭头（指向数据顶点）
    ctx.beginPath();
    if (below) {
      ctx.moveTo(cx - 6, cardY + 1);
      ctx.lineTo(cx + 6, cardY + 1);
      ctx.lineTo(cx, vertex.y + 2);
    } else {
      ctx.moveTo(cx - 6, cardY + CARD_H - 1);
      ctx.lineTo(cx + 6, cardY + CARD_H - 1);
      ctx.lineTo(cx, vertex.y - 2);
    }
    ctx.closePath();
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    ctx.setStrokeStyle(CARD_BORDER);
    ctx.setLineWidth(1);
    ctx.stroke();

    // 3) 维度名称
    ctx.setFontSize(12);
    ctx.setFillStyle(TEXT_SECONDARY);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.fillText(RADAR_DIMENSIONS[index].label, cx, cardY + 19);

    // 4) 分数（大字号）+ 百分号
    ctx.setFontSize(30);
    ctx.setFillStyle(PRIMARY);
    ctx.setTextAlign('right');
    ctx.fillText(String(data[index]), cx + 6, cardY + 48);
    ctx.setFontSize(14);
    ctx.setTextAlign('left');
    ctx.fillText('%', cx + 9, cardY + 47);

    // 5) 进度条
    const barX = cardX + 20;
    const barW = CARD_W - 40;
    const barY = cardY + 74;
    roundedRect(ctx, barX, barY, barW, 6, 3);
    ctx.setFillStyle('#e8ebe6');
    ctx.fill();
    const fillW = Math.max((barW * data[index]) / 100, 6);
    roundedRect(ctx, barX, barY, fillW, 6, 3);
    ctx.setFillStyle(PRIMARY);
    ctx.fill();
  };

  // 使用标准 Canvas 2D API 绘制（老式 createCanvasContext）
  const draw = (active: number | null) => {
    const ctx = ctxRef.current;
    const w = sizeRef.current;
    if (!ctx || !w) return;

    const half = w / 2;
    const radius = getRadius(w);

    ctx.clearRect(0, 0, w, w);

    // 基准网格（同心五边形）
    for (let level = 1; level <= RING_LEVELS; level++) {
      const r = (radius * level) / RING_LEVELS;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const p = vertexPoint(i, r, w);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.setStrokeStyle(level === RING_LEVELS ? GRID_OUTER_COLOR : GRID_COLOR);
      ctx.setLineWidth(1);
      ctx.stroke();
    }

    // 轴线
    for (let i = 0; i < count; i++) {
      const p = vertexPoint(i, radius, w);
      ctx.beginPath();
      ctx.moveTo(half, half);
      ctx.lineTo(p.x, p.y);
      ctx.setStrokeStyle(active === i ? ACTIVE_AXIS_COLOR : AXIS_COLOR);
      ctx.setLineWidth(active === i ? 2 : 1);
      ctx.stroke();
    }

    // 中心圆点
    ctx.beginPath();
    ctx.arc(half, half, 2.5, 0, Math.PI * 2);
    ctx.setFillStyle('rgba(46, 139, 87, 0.35)');
    ctx.fill();

    // 维度标签
    for (let i = 0; i < count; i++) {
      const angle = ((-90 + (i * 360) / count) * Math.PI) / 180;
      const ux = Math.cos(angle);
      const isSide = Math.abs(ux) > 0.6;
      const labelR = radius + (isSide ? 12 : 22);
      const p = vertexPoint(i, labelR, w);
      const isActive = active === i;
      ctx.setFontSize(12);
      ctx.setFillStyle(isActive ? PRIMARY : LABEL_COLOR);
      ctx.setTextBaseline('middle');
      ctx.setTextAlign(isSide ? (ux > 0 ? 'left' : 'right') : 'center');
      ctx.fillText(RADAR_DIMENSIONS[i].label, p.x, p.y);
    }

    // 数据多边形
    ctx.setGlobalAlpha(0.9);
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const r = (data[i] / 100) * radius;
      const p = vertexPoint(i, r, w);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.setFillStyle(FILL_COLOR);
    ctx.fill();
    ctx.setStrokeStyle(PRIMARY);
    ctx.setLineWidth(2);
    ctx.setLineJoin('round');
    ctx.setLineCap('round');
    ctx.stroke();
    ctx.setGlobalAlpha(1);

    // 数据点
    for (let i = 0; i < count; i++) {
      const r = (data[i] / 100) * radius;
      const p = vertexPoint(i, r, w);
      const isActive = active === i;

      if (isActive) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.setFillStyle('rgba(46, 139, 87, 0.16)');
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, isActive ? 7 : 4, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      ctx.setStrokeStyle(isActive ? PRIMARY_LIGHT : PRIMARY);
      ctx.setLineWidth(isActive ? 3 : 2);
      ctx.stroke();
    }

    // 实心悬浮评分卡（最后绘制，保证在最上层）
    if (active !== null) {
      drawTooltip(ctx, active, w);
    }

    // 提交绘制（老式 Canvas 为异步绘制）
    ctx.draw();
  };

  // 初始化 canvas 上下文并首绘
  useEffect(() => {
    const windowInfo = Taro.getSystemInfoSync();
    const windowWidth = windowInfo.windowWidth || 375;
    const w = Math.round((620 / 750) * windowWidth);
    sizeRef.current = w;
    ctxRef.current = Taro.createCanvasContext(canvasId);
    initedRef.current = true;

    // 等 canvas 节点渲染完成后再绘制
    const timer = setTimeout(() => {
      draw(activeRef.current);
    }, 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasId]);

  // 数据变化时重绘
  useEffect(() => {
    if (initedRef.current) {
      draw(activeRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 高亮变化时立即重绘
  useEffect(() => {
    activeRef.current = activeIndex;
    if (initedRef.current) draw(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.title}>适老性五维评分</Text>
        <View className={styles.avgBadge}>
          <Text className={styles.avgValue}>{avg}</Text>
          <Text className={styles.avgUnit}>综合分</Text>
        </View>
      </View>

      <View className={styles.chartBox}>
        <Canvas canvasId={canvasId} id={canvasId} className={styles.canvas} />
      </View>

      <View className={styles.rows}>
        {RADAR_DIMENSIONS.map((dim, index) => (
          <View
            key={dim.key}
            className={`${styles.row} ${activeIndex === index ? styles.rowActive : ''}`}
            onClick={() => setActiveIndex((prev) => (prev === index ? null : index))}
          >
            <View className={styles.rowLeft}>
              <View className={styles.rowDot} />
              <Text className={styles.rowName}>{dim.label}</Text>
            </View>
            <Text className={styles.rowValue}>{data[index]}%</Text>
          </View>
        ))}
      </View>

      <Text className={styles.hint}>点击下方维度，可在雷达图上查看具体评分</Text>
    </View>
  );
};

export default RadarChart;
