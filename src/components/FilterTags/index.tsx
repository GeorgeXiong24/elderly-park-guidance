import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface FilterTag {
  id: string;
  name: string;
}

export interface FilterTagsProps {
  tags: FilterTag[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ tags, selectedIds, onChange }) => {
  const toggleTag = (id: string) => {
    let nextSelected: string[];
    if (selectedIds.includes(id)) {
      nextSelected = selectedIds.filter((item) => item !== id);
    } else {
      nextSelected = [...selectedIds, id];
    }
    console.log('[FilterTags] selected:', nextSelected);
    onChange(nextSelected);
  };

  return (
    <ScrollView
      className={styles.filterTagsScroll}
      scrollX
      enableFlex
      showScrollbar={false}
    >
      <View className={styles.filterTags}>
        {tags.map((tag) => {
          const isActive = selectedIds.includes(tag.id);
          return (
            <View
              key={tag.id}
              className={classnames(styles.tag, isActive && styles.tagActive)}
              onClick={() => toggleTag(tag.id)}
            >
              <Text
                className={classnames(
                  styles.tagText,
                  isActive && styles.tagTextActive
                )}
              >
                {tag.name}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FilterTags;
