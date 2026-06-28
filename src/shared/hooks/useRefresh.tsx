import React, { useState, useCallback, useRef } from 'react';
import { RefreshControl } from 'react-native';
import { COLORS } from '../../constant/color';

type RefreshCallback = () => Promise<void> | void;

const useRefresh = (onRefreshCallback?: RefreshCallback) => {
  const [refreshing, setRefreshing] = useState(false);
  const callbackRef = useRef(onRefreshCallback);
  callbackRef.current = onRefreshCallback;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await callbackRef.current?.();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.brand}
      colors={[COLORS.brand]}
    />
  );

  return { refreshing, onRefresh, refreshControl };
};

export default useRefresh;