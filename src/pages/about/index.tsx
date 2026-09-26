import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const AboutPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.title}>关于我们</Text>
        <Text className={styles.desc}>
          深圳长者公园指南致力于为深圳老年朋友提供便捷、实用的公园导览服务，帮助大家找到适合休闲、锻炼和社交的绿色空间。
        </Text>
      </View>
    </View>
  );
};

export default AboutPage;
