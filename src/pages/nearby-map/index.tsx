import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CoverImage, CoverView, Map, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { PARKS } from '@/data/parks';
import { PARK_PAGE } from '@/data/parkGroup';
import { getParkLocation } from '@/data/parkLocations';
import type { Park } from '@/types/park';
import parkMarker from '@/assets/tabbar/parks-selected.png';
import styles from './index.module.scss';

const MAP_VIEW_DIAMETER_METERS = 15000;
const SEARCH_RADIUS_METERS = 5000;
const EARTH_CIRCUMFERENCE_METERS = 40075016.686;

interface Coordinates {
  latitude: number;
  longitude: number;
}

const getMapScale = (latitude: number) => {
  const { windowWidth } = Taro.getSystemInfoSync();
  const metersPerPixelAtZoomZero =
    (EARTH_CIRCUMFERENCE_METERS * Math.cos((latitude * Math.PI) / 180)) / 256;
  const scale = Math.ceil(
    Math.log2(
      (metersPerPixelAtZoomZero * windowWidth) / MAP_VIEW_DIAMETER_METERS
    )
  );

  return Math.max(3, Math.min(20, scale));
};

const parkMarkers = PARKS.flatMap((park, index) => {
  const parkLocation = getParkLocation(park.id);
  if (!parkLocation) {
    return [];
  }

  return [
    {
      id: index + 1,
      latitude: parkLocation.parkLatitude,
      longitude: parkLocation.parkLongitude,
      title: park.name,
      iconPath: parkMarker,
      width: 28,
      height: 28,
    },
  ];
});

const NearbyMapPage: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationError, setHasLocationError] = useState(false);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const popupCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (popupCloseTimer.current) {
        clearTimeout(popupCloseTimer.current);
      }
    },
    []
  );

  const loadLocation = useCallback(async () => {
    setIsLoading(true);
    setHasLocationError(false);

    try {
      const result = await Taro.getLocation({ type: 'gcj02' });
      setLocation({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    } catch (error) {
      console.error('[NearbyMapPage] Failed to get current location:', error);
      setHasLocationError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLocation();
  }, [loadLocation]);

  const handleRetry = async () => {
    try {
      const { authSetting } = await Taro.getSetting();
      if (authSetting['scope.userLocation'] === false) {
        await Taro.openSetting();
      }
      await loadLocation();
    } catch (error) {
      console.error('[NearbyMapPage] Failed to open location settings:', error);
      setHasLocationError(true);
      setIsLoading(false);
    }
  };

  const handleMarkerTap = (event: { detail: { markerId: number | string } }) => {
    const markerId = Number(event.detail.markerId);
    const park = PARKS.find((_, index) => index + 1 === markerId);

    if (!park) {
      console.error('[NearbyMapPage] No park found for marker:', event.detail.markerId);
      return;
    }

    if (popupCloseTimer.current) {
      clearTimeout(popupCloseTimer.current);
      popupCloseTimer.current = null;
    }
    setIsPopupClosing(false);
    setSelectedPark(park);
  };

  const closePopup = () => {
    if (!selectedPark || isPopupClosing) {
      return;
    }

    setIsPopupClosing(true);
    popupCloseTimer.current = setTimeout(() => {
      setSelectedPark(null);
      setIsPopupClosing(false);
      popupCloseTimer.current = null;
    }, 220);
  };

  const handleShowDetails = async () => {
    if (!selectedPark) {
      return;
    }

    const page = PARK_PAGE[selectedPark.id];
    if (!page) {
      Taro.showToast({ title: '该公园暂未开放详情', icon: 'none' });
      return;
    }

    try {
      await Taro.navigateTo({ url: `${page}?id=${selectedPark.id}` });
      setSelectedPark(null);
    } catch (error) {
      console.error('[NearbyMapPage] Failed to open park details:', error);
      Taro.showToast({ title: '打开公园详情失败', icon: 'none' });
    }
  };

  const handleNavigateToPark = async () => {
    if (!selectedPark) {
      return;
    }

    const parkLocation = getParkLocation(selectedPark.id);
    if (!parkLocation) {
      console.error('[NearbyMapPage] No location found for park:', selectedPark.id);
      Taro.showToast({ title: '暂时无法获取公园入口位置', icon: 'none' });
      return;
    }

    try {
      await Taro.openLocation({
        latitude: parkLocation.parkLatitude,
        longitude: parkLocation.parkLongitude,
        name: selectedPark.name,
        address: parkLocation.parkAddress,
        scale: 18,
      });
    } catch (error) {
      console.error('[NearbyMapPage] Failed to open park navigation:', error);
      Taro.showToast({ title: '打开导航失败', icon: 'none' });
    }
  };

  if (!location) {
    return (
      <View className={styles.statePage}>
        <Text className={styles.stateText}>
          {isLoading ? '正在获取当前位置…' : '暂时无法获取当前位置'}
        </Text>
        {!isLoading && hasLocationError && (
          <>
            <Text className={styles.hintText}>请允许使用定位权限后重试</Text>
            <View className={styles.retryButton} onClick={handleRetry}>
              <Text className={styles.retryButtonText}>重新定位</Text>
            </View>
          </>
        )}
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <Map
        className={styles.map}
        latitude={location.latitude}
        longitude={location.longitude}
        scale={getMapScale(location.latitude)}
        markers={parkMarkers}
        circles={[
          {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: SEARCH_RADIUS_METERS,
            color: '#2e8b5799',
            fillColor: '#2e8b571a',
            strokeWidth: 2,
          },
        ]}
        showLocation
        showCompass
        onMarkerTap={handleMarkerTap}
        onError={(event) =>
          console.error('[NearbyMapPage] Map failed to render:', event.detail)
        }
      />
      <View className={styles.rangeBadge}>
        <Text className={styles.rangeTitle}>地图</Text>
        <Text className={styles.rangeCount}>{parkMarkers.length} 个公园位置</Text>
      </View>
      <View className={styles.relocateButton} onClick={loadLocation}>
        <Text className={styles.relocateButtonText}>重新定位</Text>
      </View>
      {selectedPark && (
        <CoverView
          className={`${styles.popupBackdrop} ${isPopupClosing ? styles.popupClosing : ''}`}
          onClick={closePopup}
        >
          <CoverView
            className={styles.popupSheet}
            onClick={(event) => event.stopPropagation()}
          >
            <CoverView className={styles.popupClose} onClick={closePopup}>
              ×
            </CoverView>
            <CoverView className={styles.popupContent}>
              {selectedPark.imageUrl && (
                <CoverView className={styles.popupImageCrop}>
                  <CoverImage
                    className={styles.popupImage}
                    src={selectedPark.imageUrl}
                  />
                </CoverView>
              )}
              <CoverView className={styles.popupTitle}>{selectedPark.name}</CoverView>
              <CoverView className={styles.ratingRow}>
                <CoverView className={styles.ratingLabel}>综合评分</CoverView>
                <CoverView className={styles.ratingValue}>
                  {selectedPark.rating.toFixed(1)}
                  <CoverView className={styles.ratingMax}> / 5.0</CoverView>
                </CoverView>
              </CoverView>
              <CoverView className={styles.popupActions}>
                <CoverView
                  className={styles.detailsButton}
                  onClick={handleShowDetails}
                >
                  详细信息
                </CoverView>
                <CoverView
                  className={styles.navigationButton}
                  onClick={handleNavigateToPark}
                >
                  一键导航
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        </CoverView>
      )}
    </View>
  );
};

export default NearbyMapPage;
