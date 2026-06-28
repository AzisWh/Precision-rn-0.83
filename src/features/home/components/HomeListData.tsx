import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from '../../../routes';

import CardListData from './CardListData';
import useDeliveryTable from '../hooks/useDeliveryHooks';
import ImageCard from '../../../components/ImageCard';
import { COLORS } from '../../../constant/color';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/StateComponents';

const HomeListData = () => {
  const { deliveryNotes, isLoading, isError } = useDeliveryTable();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (deliveryNotes.length === 0)
    return <EmptyState message="Belum ada data pengiriman" />;

  const latestThree =
    deliveryNotes
      ?.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      ?.slice(0, 3) ?? [];

  return (
    <View style={styles.container}>
      {latestThree.map(item => (
        <CardListData
          key={item.id}
          dnCode={item.dn_code}
          routeFrom={item.route_from}
          routeTo={item.route_to}
          updatedAt={item.updated_at}
          status={item.status}
          onPress={() => navigation.navigate(ROUTES.DN_DETAIL, { item })}
        />
      ))}
      <ImageCard
        source={require('../../../app/assets/img/img-warehouse.jpg')}
        title="Warehouse Insight"
        subtitle="Real-time throughput data suggests increased volume in Sector 7 tonight."
        titleColor={COLORS.white}
        subtitleColor={COLORS.blueLight}
        overlayColor="rgba(0, 71, 87, 0.72)"
        width={undefined}
        style={{ width: '100%' }}
      />
    </View>
  );
};

export default HomeListData;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // marginBottom: 24,
    paddingVertical: 24,
    // marginTop: 24,
  },
});
