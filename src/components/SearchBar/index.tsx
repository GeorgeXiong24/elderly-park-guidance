import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '输入公园名称/区域',
  onSearch,
}) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    console.log('[SearchBar] search keyword:', keyword);
    onSearch?.(keyword);
  };

  const handleConfirm = (event: Taro.ITouchEvent) => {
    const value = event.detail?.value as string;
    console.log('[SearchBar] confirm keyword:', value);
    onSearch?.(value);
  };

  return (
    <View className={styles.searchBar}>
      <View className={styles.inputWrap}>
        <View className={styles.icon}>
          <View className={styles.magnifier} />
        </View>
        <Input
          className={styles.input}
          type="text"
          confirmType="search"
          placeholder={placeholder}
          placeholderClass={styles.placeholder}
          value={keyword}
          onInput={(event) => setKeyword(event.detail.value)}
          onConfirm={handleConfirm}
        />
      </View>
      <View
        className={classnames(styles.searchButton)}
        onClick={handleSearch}
      >
        <Text className={styles.searchButtonText}>搜索</Text>
      </View>
    </View>
  );
};

export default SearchBar;
