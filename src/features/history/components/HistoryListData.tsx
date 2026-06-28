import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from '../../../routes';
import useHistoryTable from '../hooks/historyHooks';
import CardListData from '../../home/components/CardListData';
import ImageCard from '../../../components/ImageCard';
import { COLORS } from '../../../constant/color';
import HistoryListCard from './HistoryListCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/StateComponents';

const HistoryListData = () => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  const { deliveryNotes, isLoading, isError } = useHistoryTable();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    console.log('Delivery Notes:', deliveryNotes);
  }, [deliveryNotes]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (deliveryNotes.length === 0)
    return <EmptyState message="Belum ada history pengiriman" />;

  return (
    <View style={styles.container}>
      {deliveryNotes.map(item => (
        <HistoryListCard
          key={item.id}
          dnCode={item.dn_code}
          recipient={item.recipient}
          signedBy={item.signed_by}
          updatedAt={item.updated_at}
          status={item.status}
          deliveryType={item.delivery_type}
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

export default HistoryListData;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    // marginTop: 24,
    // gap: 16,
  },
});
