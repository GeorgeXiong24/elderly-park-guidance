import React, { useEffect, useState } from 'react';
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { PARKS } from '@/data/parks';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import styles from './index.module.scss';

const ParkDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';
  const park = PARKS.find((item) => item.id === id);
  const photos = PARK_PHOTOS[id] || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (park) {
      Taro.setNavigationBarTitle({ title: park.name });
    }
  }, [park]);

  const handleChange = (event: { detail: { current: number } }) => {
    setCurrent(event.detail.current);
  };

  return (
    <View className={styles.page}>
      <View className={styles.swiperWrap}>
        <Swiper
          className={styles.swiper}
          indicatorDots
          circular
          indicatorColor="rgba(255, 255, 255, 0.5)"
          indicatorActiveColor="#2e8b57"
          onChange={handleChange}
        >
          {photos.map((photo, index) => (
            <SwiperItem key={index}>
              <Image className={styles.photo} src={photo} mode="aspectFill" />
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
        {park && (
          <View className={styles.meta}>
            <Text className={styles.rating}>评分 {park.rating.toFixed(1)}/5.0</Text>
            <Text className={styles.features}>{park.features.join(' | ')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ParkDetailPage;
