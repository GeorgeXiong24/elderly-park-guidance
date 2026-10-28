import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { PARKS } from '@/data/parks';
import { getParkRadarScore, getParkWeightedScore } from '@/data/parkRadar';
import { getParkLocation } from '@/data/parkLocations';
import RadarChart from '@/components/RadarChart';
import LocationMap from '@/components/LocationMap';
import styles from './index.module.scss';

export interface ParkDetailViewProps {
  // 当前分包里的公园图片：{ 公园id: [图片路径...] }
  photos: Record<string, string[]>;
}

const getRatingLabel = (rating: number): { text: string; className: string } => {
  const percent = (rating / 5) * 100;
  if (percent >= 85) return { text: '优', className: styles.ratingLabelExcellent };
  if (percent >= 70) return { text: '良', className: styles.ratingLabelGood };
  if (percent >= 55) return { text: '一般', className: styles.ratingLabelAverage };
  return { text: '待改善', className: styles.ratingLabelImprove };
};

const ParkDetailView: React.FC<ParkDetailViewProps> = ({ photos: photoMap }) => {
  const router = useRouter();
  const id = router.params.id || '';
  const park = PARKS.find((item) => item.id === id);
  const parkPhotos = photoMap[id] || [];
  // 兜底：万一某个公园还没配图，就显示它的封面，避免空白
  const photos = parkPhotos.length > 0 ? parkPhotos : (park?.imageUrl ? [park.imageUrl] : []);
  const radarScore = park ? getParkRadarScore(park.id) : undefined;
  const weightedScore = park ? getParkWeightedScore(park.id) : undefined;
  const location = park ? getParkLocation(park.id) : undefined;
  const rating = park ? getRatingLabel(park.rating) : null;
  const [current, setCurrent] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (park) {
      Taro.setNavigationBarTitle({ title: park.name });
    }
  }, [park]);

  const handleChange = (event: { detail: { current: number } }) => {
    setCurrent(event.detail.current);
  };

  const handlePreviewImage = (index: number) => {
    if (photos.length === 0) return;
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setCurrent(previewIndex);
    setPreviewOpen(false);
  };

  const handlePreviewPrev = () => {
    setPreviewIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handlePreviewNext = () => {
    setPreviewIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handlePreviewChange = (event: { detail: { current: number } }) => {
    setPreviewIndex(event.detail.current);
  };

  return (
    <View className={styles.page}>
      {!previewOpen && (
        <>
          <View className={styles.swiperWrap}>
            <Swiper
              className={styles.swiper}
              current={current}
              indicatorDots
              circular
              indicatorColor="rgba(255, 255, 255, 0.5)"
              indicatorActiveColor="#2e8b57"
              onChange={handleChange}
            >
              {photos.map((photo, index) => (
                <SwiperItem key={index}>
                  <Image
                    className={styles.photo}
                    src={photo}
                    mode="aspectFill"
                    onClick={() => handlePreviewImage(index)}
                  />
                </SwiperItem>
              ))}
            </Swiper>
            {photos.length > 0 && (
              <View className={styles.counter}>
                <Text className={styles.counterText}>
                  {current + 1}/{photos.length}
                </Text>
              </View>
            )}
          </View>

          <View className={styles.content}>
            <Text className={styles.title}>{park?.name || '公园详情'}</Text>
            {park && rating && (
              <View className={styles.meta}>
                <View className={styles.ratingRow}>
                  <Text className={styles.rating}>评分 {park.rating.toFixed(1)}/5.0</Text>
                  <View className={`${styles.ratingLabel} ${rating.className}`}>
                    <Text className={styles.ratingLabelText}>{rating.text}</Text>
                  </View>
                </View>
                <Text className={styles.features}>{park.features.join(' | ')}</Text>
              </View>
            )}
          </View>

          {radarScore && (
            <View className={styles.radarSection}>
              <RadarChart data={radarScore} weightedScore={weightedScore} />
            </View>
          )}

          {location && <LocationMap location={location} />}
        </>
      )}

      {previewOpen && (
        <View className={styles.previewMask}>
          <Swiper
            className={styles.previewSwiper}
            current={previewIndex}
            circular
            onChange={handlePreviewChange}
          >
            {photos.map((photo, index) => (
              <SwiperItem key={index}>
                <ScrollView
                  className={styles.previewScroll}
                  scrollY
                  scrollWithAnimation={false}
                  onClick={handleClosePreview}
                >
                  <View className={styles.previewBody}>
                    <Image
                      className={styles.previewImage}
                      src={photo}
                      mode="widthFix"
                    />
                  </View>
                </ScrollView>
              </SwiperItem>
            ))}
          </Swiper>
          {photos.length > 1 && (
            <>
              <View
                className={styles.previewPrev}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewPrev();
                }}
              >
                <Text className={styles.previewNavText}>‹</Text>
              </View>
              <View
                className={styles.previewNext}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewNext();
                }}
              >
                <Text className={styles.previewNavText}>›</Text>
              </View>
            </>
          )}
          <View className={styles.previewCounter}>
            <Text className={styles.previewCounterText}>
              {previewIndex + 1}/{photos.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ParkDetailView;
