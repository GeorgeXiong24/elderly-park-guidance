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
  // 延迟挂载 Canvas 节点：等页面布局完全稳定后再插入，避免同层 Canvas 位置缓存导致错位
  const [canvasMounted, setCanvasMounted] = useState(false);

  const canvasRef = useRef<any>(null);
  const ctxRef = useRef<any>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const initedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const count = RADAR_DIMENSIONS.length;

  const avg = useMemo(
    () => Math.round(data.reduce((sum, value) => sum + value, 0) / data.length),
    [data]
  );

  // 几何计算（基于 CSS 像素）
  const getRadius = (w: number) => (w / 2) * (86 / 155);
  const vertexPoint = (index: number, radius: number, w: number, h: number): Point => {
    const angle = ((-90 + (index * 360) / count) * Math.PI) / 180;
    return {
      x: w / 2 + radius * Math.cos(angle),
      y: h / 2 + radius * Math.sin(angle),
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
    const vertex = vertexPoint(index, (data[index] / 100) * radius, w, w);
    const below = vertex.y <= w * 0.45;

    // 卡片水平居中于顶点，并限制在画布内
    const cx = Math.min(Math.max(vertex.x, CARD_W / 2 + 4), w - CARD_W / 2 - 4);
    const cardX = cx - CARD_W / 2;
    const cardY = below ? vertex.y + 12 : vertex.y - 12 - CARD_H;

    // 1) 实心白色底板（带投影）
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 5;
    roundedRect(ctx, cardX, cardY, CARD_W, CARD_H, CARD_RADIUS);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // 边框（纯色，不影响实心度）
    roundedRect(ctx, cardX, cardY, CARD_W, CARD_H, CARD_RADIUS);
    ctx.strokeStyle = CARD_BORDER;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2) 实心箭头（指向数据顶点）
    ctx.beginPath();
    if (below) {
      const baseY = cardY + 1;
      const apexY = vertex.y + 2;
      ctx.moveTo(cx - 6, baseY);
      ctx.lineTo(cx + 6, baseY);
      ctx.lineTo(cx, apexY);
    } else {
      const baseY = cardY + CARD_H - 1;
      const apexY = vertex.y - 2;
      ctx.moveTo(cx - 6, baseY);
      ctx.lineTo(cx + 6, baseY);
      ctx.lineTo(cx, apexY);
    }
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = CARD_BORDER;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3) 维度名称
    ctx.font = '12px sans-serif';
    ctx.fillStyle = TEXT_SECONDARY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(RADAR_DIMENSIONS[index].label, cx, cardY + 19);

    // 4) 分数（大字号）+ 百分号
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = PRIMARY;
    ctx.textAlign = 'right';
    ctx.fillText(String(data[index]), cx + 6, cardY + 48);
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('%', cx + 9, cardY + 47);

    // 5) 进度条
    const barX = cardX + 20;
    const barW = CARD_W - 40;
    const barY = cardY + 74;
    roundedRect(ctx, barX, barY, barW, 6, 3);
    ctx.fillStyle = '#e8ebe6';
    ctx.fill();
    const fillW = Math.max((barW * data[index]) / 100, 6);
    roundedRect(ctx, barX, barY, fillW, 6, 3);
    ctx.fillStyle = PRIMARY;
    ctx.fill();
  };

  // 使用标准 Canvas 2D API 绘制
  const draw = (active: number | null, progress: number) => {
    const ctx = ctxRef.current;
    const { w, h } = sizeRef.current;
    if (!ctx || !w) return;

    const half = w / 2;
    const radius = getRadius(w);

    ctx.clearRect(0, 0, w, h);

    // 基准网格（同心五边形）
    for (let level = 1; level <= RING_LEVELS; level++) {
      const r = (radius * level) / RING_LEVELS;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const p = vertexPoint(i, r, w, h);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === RING_LEVELS ? GRID_OUTER_COLOR : GRID_COLOR;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 轴线
    for (let i = 0; i < count; i++) {
      const p = vertexPoint(i, radius, w, h);
      ctx.beginPath();
      ctx.moveTo(half, half);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = active === i ? ACTIVE_AXIS_COLOR : AXIS_COLOR;
      ctx.lineWidth = active === i ? 2 : 1;
      ctx.stroke();
    }

    // 中心圆点
    ctx.beginPath();
    ctx.arc(half, half, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(46, 139, 87, 0.35)';
    ctx.fill();

    // 维度标签
    for (let i = 0; i < count; i++) {
      const angle = ((-90 + (i * 360) / count) * Math.PI) / 180;
      const ux = Math.cos(angle);
      const isSide = Math.abs(ux) > 0.6;
      const labelR = radius + (isSide ? 12 : 22);
      const p = vertexPoint(i, labelR, w, h);
      const isActive = active === i;
      ctx.font = `${isActive ? 'bold ' : ''}12px sans-serif`;
      ctx.fillStyle = isActive ? PRIMARY : LABEL_COLOR;
      ctx.textBaseline = 'middle';
      ctx.textAlign = isSide ? (ux > 0 ? 'left' : 'right') : 'center';
      ctx.fillText(RADAR_DIMENSIONS[i].label, p.x, p.y);
    }

    // 数据多边形（带入场进度）
    const groupAlpha = 0.35 + 0.65 * progress;
    ctx.globalAlpha = groupAlpha;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const r = (data[i] / 100) * radius * progress;
      const p = vertexPoint(i, r, w, h);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = FILL_COLOR;
    ctx.fill();
    ctx.strokeStyle = PRIMARY;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 数据点
    for (let i = 0; i < count; i++) {
      const r = (data[i] / 100) * radius * progress;
      const p = vertexPoint(i, r, w, h);
      const isActive = active === i;

      if (isActive) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(46, 139, 87, 0.16)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, isActive ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = isActive ? PRIMARY_LIGHT : PRIMARY;
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.stroke();
    }

    // 实心悬浮评分卡（最后绘制，保证在最上层、完全不透底）
    if (active !== null) {
      drawTooltip(ctx, active, w);
    }
  };

  // 入场动画
  const runEntrance = (canvas: any, duration: number) => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      draw(activeRef.current, eased);
      if (t < 1) {
        rafRef.current = canvas.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    tick();
  };

  // 查询节点信息
  const queryNode = (): Promise<any> =>
    new Promise((resolve) => {
      Taro.createSelectorQuery()
        .select(`#${canvasId}`)
        .fields({ node: true, size: true, rect: true })
        .exec((res) => resolve(res && res[0] ? res[0] : null));
    });

  // 延迟挂载 Canvas：等待页面首帧布局完成
  useEffect(() => {
    const timer = setTimeout(() => {
      // 再等一个渲染帧，确保上方标题/元信息布局已落定
      Taro.nextTick(() => setCanvasMounted(true));
    }, 320) as unknown as number;
    timersRef.current.push(timer);
    return () => clearTimeout(timer);
  }, []);

  // Canvas 挂载后初始化：二次校验尺寸位置稳定后再创建位图
  useEffect(() => {
    if (!canvasMounted) return;
    let cancelled = false;

    const addTimer = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay) as unknown as number;
      timersRef.current.push(t);
    };

    const initBitmap = (result: any) => {
      if (cancelled || initedRef.current) return;
      const canvas = result.node;
      const ctx = canvas.getContext('2d');
      let dpr = 2;
      try {
        dpr = (Taro.getWindowInfo ? Taro.getWindowInfo() : Taro.getSystemInfoSync()).pixelRatio || 2;
      } catch (err) {
        dpr = 2;
      }
      canvas.width = Math.round(result.width * dpr);
      canvas.height = Math.round(result.height * dpr);
      ctx.scale(dpr, dpr);

      canvasRef.current = canvas;
      ctxRef.current = ctx;
      sizeRef.current = { w: result.width, h: result.height };
      initedRef.current = true;

      runEntrance(canvas, 600);

      // 安全重绘：布局彻底稳定后再画一次，纠正潜在的同层合成异常
      addTimer(() => {
        if (!cancelled) draw(activeRef.current, 1);
      }, 900);
    };

    // 连续两次查询的尺寸与位置一致，才认为布局稳定
    const confirmAndInit = (prev: any, rounds: number) => {
      if (cancelled) return;
      addTimer(async () => {
        if (cancelled) return;
        const latest = await queryNode();
        if (!latest || !latest.node) {
          if (rounds < 6) confirmAndInit(prev, rounds + 1);
          return;
        }
        const stable =
          Math.abs(latest.width - prev.width) < 2 &&
          Math.abs(latest.height - prev.height) < 2 &&
          Math.abs(latest.top - prev.top) < 2 &&
          Math.abs(latest.left - prev.left) < 2;
        if (stable || rounds >= 6) {
          initBitmap(latest);
        } else {
          confirmAndInit(latest, rounds + 1);
        }
      }, 220);
    };

    const firstTry = async (attempts: number) => {
      if (cancelled) return;
      const result = await queryNode();
      if (!result || !result.node || !result.width) {
        if (attempts < 8) addTimer(() => firstTry(attempts + 1), 120);
        return;
      }
      confirmAndInit(result, 0);
    };
    addTimer(() => firstTry(0), 80);

    return () => {
      cancelled = true;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
      if (rafRef.current !== null && canvasRef.current) {
        try {
          canvasRef.current.cancelAnimationFrame(rafRef.current);
        } catch (err) {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasId, canvasMounted]);

  // 数据变化时重播入场动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !initedRef.current) return;
    const duration = 500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      draw(activeRef.current, eased);
      if (t < 1) {
        rafRef.current = canvas.requestAnimationFrame(tick);
      }
    };
    tick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 高亮变化时立即重绘
  useEffect(() => {
    activeRef.current = activeIndex;
    if (initedRef.current) draw(activeIndex, 1);
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
        {/* 雷达图仅用于展示，不响应触摸，避免误触与兼容问题 */}
        {canvasMounted ? (
          <Canvas type="2d" id={canvasId} canvasId={canvasId} className={styles.canvas} />
        ) : (
          <View className={styles.chartPlaceholder} />
        )}
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
