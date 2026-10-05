import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SearchBar from '@/components/SearchBar';
import FilterTags from '@/components/FilterTags';
import ParkCard from '@/components/ParkCard';
import { PARKS, FILTER_TAGS } from '@/data/parks';
import type { Park } from '@/types/park';
import styles from './index.module.scss';

const systemInfo = Taro.getSystemInfoSync();
const statusBarHeight = systemInfo.statusBarHeight || 0;

const ParksPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(['all']);

  const filteredParks = useMemo<Park[]>(() => {
    let result = [...PARKS];

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (park) =>
          park.name.toLowerCase().includes(lowerKeyword) ||
          park.region.toLowerCase().includes(lowerKeyword)
      );
    }

    const activeFeatureTags = selectedTagIds.filter((id) => id !== 'all');
    if (activeFeatureTags.length > 0) {
      result = result.filter((park) =>
        activeFeatureTags.every((tagId) => park.features.includes(tagId))
      );
    }

    return result;
  }, [keyword, selectedTagIds]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    console.log('[ParksPage] search:', value);
  };

  const handleFilterChange = (ids: string[]) => {
    const hasAll = ids.includes('all');
    const hadAll = selectedTagIds.includes('all');

    if (hasAll && !hadAll) {
      setSelectedTagIds(['all']);
      return;
    }

    const featureIds = ids.filter((id) => id !== 'all');
    if (featureIds.length === 0) {
      setSelectedTagIds(['all']);
      return;
    }

    setSelectedTagIds(featureIds);
  };

  const handleScrollToLower = () => {
    console.log('[ParksPage] scroll to lower');
    Taro.showToast({ title: '已加载全部公园', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View
        className={styles.header}
        style={{ paddingTop: `${statusBarHeight + 12}px` }}
      >
        <Text className={styles.title}>深圳长者公园指南</Text>
      </View>

      <View className={styles.searchSection}>
        <SearchBar placeholder="输入公园名称/区域" onSearch={handleSearch} />
      </View>

      <View className={styles.filterSection}>
        <FilterTags
          tags={FILTER_TAGS}
          selectedIds={selectedTagIds}
          onChange={handleFilterChange}
        />
      </View>

      <ScrollView
        className={styles.listScroll}
        scrollY
        lowerThreshold={100}
        onScrollToLower={handleScrollToLower}
      >
        <View className={styles.list}>
          {filteredParks.map((park) => (
            <View key={park.id} className={styles.listItem}>
              <ParkCard park={park} />
            </View>
          ))}
        </View>

        {filteredParks.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>未找到符合条件的公园</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ParksPage;
