import React, { useEffect } from 'react';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import { CLOUD_ENV, isCloudReady } from './config/cloud';
// 全局样式
import './app.scss';

if (process.env.TARO_ENV === 'weapp' && isCloudReady()) {
  if (!Taro.cloud) {
    console.warn('[cloud] Taro.cloud 未就绪，请确认已开通云开发');
  } else {
    Taro.cloud.init({ env: CLOUD_ENV });
  }
}

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {});
  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
