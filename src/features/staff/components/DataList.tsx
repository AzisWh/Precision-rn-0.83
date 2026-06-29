import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/StateComponents';
import { useNavigation } from '@react-navigation/native';
import getAllDelivery from '../hooks/getDeliveryHooks';
import CardListData from '../../../components/CardListData';
import StaffHero from './StaffHero';
import { RootStackParamList, ROUTES } from '../../../routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList } from 'react-native-gesture-handler';
import useRefresh from '../../../shared/hooks/useRefresh';

const DataList = () => {
  const {
    deliveryNotes,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = getAllDelivery();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { refreshControl } = useRefresh(async () => {
    await refetch();
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  if (deliveryNotes.length === 0)
    return <EmptyState message="Belum ada data pengiriman" />;

  console.log('Delivery Notes:', deliveryNotes);
  return (
    <FlatList
      data={deliveryNotes}
      refreshControl={refreshControl}
      keyExtractor={item => item.id}
      ListHeaderComponent={StaffHero}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <CardListData
            key={item.id}
            dnCode={item.dn_code}
            routeFrom={item.route_from}
            routeTo={item.route_to}
            updatedAt={item.updated_at}
            status={item.status}
            onPress={() => navigation.navigate(ROUTES.DN_DETAIL, { item })}
          />
        </View>
      )}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isFetchingNextPage ? <LoadingState /> : null}
    />
  );
};

export default DataList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // marginBottom: 24,
    // paddingVertical: 24,
    // marginTop: 24,
  },
});
