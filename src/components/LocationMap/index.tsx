import React from 'react';
import { View, Text, Map } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { ParkLocation } from '@/data/parkLocations';
import styles from './index.module.scss';

export interface LocationMapProps {
  location: ParkLocation;
}

const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  // 公园与医疗点坐标是否重合
  const isSamePoint =
    Math.abs(location.parkLatitude - location.medicalLatitude) < 1e-6 &&
    Math.abs(location.parkLongitude - location.medicalLongitude) < 1e-6;

  // 重合时给医疗点一个显示偏移（约 100 米），让两个标记在地图上错开；
  // 真实坐标与导航不变。
  const medicalDisplayLatitude = isSamePoint
    ? location.medicalLatitude + 0.001
    : location.medicalLatitude;
  const medicalDisplayLongitude = location.medicalLongitude;

  const centerLatitude = (location.parkLatitude + medicalDisplayLatitude) / 2;
  const centerLongitude = (location.parkLongitude + medicalDisplayLongitude) / 2;

  const markers = [
    {
      id: 0,
      latitude: location.parkLatitude,
      longitude: location.parkLongitude,
      width: 30,
      height: 30,
      title: location.parkName,
      label: { content: '公园', color: '#2e8b57', fontSize: 12, anchorX: 0, anchorY: -20 },
      callout: {
        content: location.parkName,
        color: '#2e8b57',
        fontSize: 14,
        borderRadius: 8,
        padding: 8,
        display: 'BYCLICK',
      },
    },
    {
      id: 1,
      latitude: medicalDisplayLatitude,
      longitude: medicalDisplayLongitude,
      width: 30,
      height: 30,
      title: location.medicalName,
      label: { content: '医疗点', color: '#e64340', fontSize: 12, anchorX: 0, anchorY: -20 },
      callout: {
        content: location.medicalName,
        color: '#e64340',
        fontSize: 14,
        borderRadius: 8,
        padding: 8,
        display: 'BYCLICK',
      },
    },
  ];

  // 在两点连线外侧扩展 1/3，让公园与医疗点约占视野 3/4（留出边距）
  // 两点重合时改用固定缩放，避免视野过小
  const expandRatio = 4 / 3;
  const midLatitude = (location.parkLatitude + medicalDisplayLatitude) / 2;
  const midLongitude = (location.parkLongitude + medicalDisplayLongitude) / 2;
  const halfLatitude = Math.abs(location.parkLatitude - medicalDisplayLatitude) / 2;
  const halfLongitude = Math.abs(location.parkLongitude - medicalDisplayLongitude) / 2;

  const includePoints = isSamePoint
    ? undefined
    : [
        { latitude: location.parkLatitude, longitude: location.parkLongitude },
        { latitude: medicalDisplayLatitude, longitude: medicalDisplayLongitude },
        {
          latitude: midLatitude + halfLatitude * expandRatio,
          longitude: midLongitude + halfLongitude * expandRatio,
        },
        {
          latitude: midLatitude - halfLatitude * expandRatio,
          longitude: midLongitude - halfLongitude * expandRatio,
        },
      ];

  const handleNavigate = (
    name: string,
    address: string,
    latitude: number,
    longitude: number
  ) => {
    Taro.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18,
    });
  };

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: location.medicalPhone,
      fail: () => {
        // 用户取消拨号，静默处理
      },
    });
  };

  return (
    <View className={styles.locationSection}>
      <View className={styles.mapWrap}>
        <Map
          className={styles.map}
          latitude={centerLatitude}
          longitude={centerLongitude}
          markers={markers}
          includePoints={includePoints}
          scale={isSamePoint ? 14 : 13}
          showLocation={false}
        />
      </View>

      <View className={styles.locationRow}>
        <View className={styles.locationInfo}>
          <Text className={styles.locationName}>{location.parkName}</Text>
        </View>
        <View
          className={styles.navButton}
          onClick={() =>
            handleNavigate(
              location.parkName,
              location.parkAddress,
              location.parkLatitude,
              location.parkLongitude
            )
          }
        >
          <Text className={styles.navButtonText}>一键导航</Text>
        </View>
      </View>

      <View className={styles.locationRow}>
        <View className={styles.locationInfo}>
          <Text className={styles.locationName}>附近医疗点</Text>
          <Text className={styles.locationAddress}>{location.medicalName}</Text>
          <Text className={styles.locationPhone}>{location.medicalPhone}</Text>
        </View>
        <View className={styles.actions}>
          <View
            className={styles.navButton}
            onClick={() =>
              handleNavigate(
                location.medicalName,
                location.medicalAddress,
                location.medicalLatitude,
                location.medicalLongitude
              )
            }
          >
            <Text className={styles.navButtonText}>一键导航</Text>
          </View>
          <View className={styles.callButton} onClick={handleCall}>
            <Text className={styles.callButtonText}>拨打电话</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LocationMap;
