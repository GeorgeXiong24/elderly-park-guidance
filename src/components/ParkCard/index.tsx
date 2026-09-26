import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { Park } from '@/types/park';
import styles from './index.module.scss';

export interface ParkCardProps {
  park: Park;
}

const ParkCard: React.FC<ParkCardProps> = ({ park }) => {
  const handleClick = () => {
    console.log('[ParkCard] navigate to detail:', park.id);
    Taro.navigateTo({
      url: `/pages/park-detail/index?id=${park.id}`,
    });
  };

  const handleImageError = () => {
    console.error('[ParkCard] image load error:', park.id);
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrap}>
        {park.imageUrl ? (
          <Image
            className={styles.image}
            src={park.imageUrl}
            mode="aspectFill"
            lazyLoad
            onError={handleImageError}
          />
        ) : (
          <View className={styles.imagePlaceholder}>
            <Text className={styles.placeholderText}>图片上传位</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{park.name}</Text>
          <Text className={styles.rating}>{park.rating.toFixed(1)}/5.0</Text>
        </View>
        <Text className={styles.features}>{park.features.join('|')}</Text>
      </View>
    </View>
  );
};

export default ParkCard;
