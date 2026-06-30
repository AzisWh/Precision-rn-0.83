import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { DeliveryNote } from '../../delivery-detail/type';
import useRefresh from '../../../shared/hooks/useRefresh';
import { useDeliveryPicCounts, useDeliveryPicList } from '../hooks/useDeliveryPic';
import { useMemo, useState } from 'react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/StateComponents';
import { COLORS } from '../../../constant/color';
import CardListData from '../../../components/CardListData';
import { RootStackParamList, ROUTES } from '../../../routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TabKey = 'sampai' | 'selesai';

type TabConfig = {
  key: TabKey;
  label: string;
  statuses: DeliveryNote['status'][];
  emptyMessage: string;
};

const TABS: TabConfig[] = [
  {
    key: 'sampai',
    label: 'Sampai',
    statuses: ['arrived'],
    emptyMessage: 'Tidak ada pengiriman yang sampai',
  },
  {
    key: 'selesai',
    label: 'Selesai',
    statuses: ['completed'],
    emptyMessage: 'Belum ada pengiriman selesai',
  },
];

const DataListPic = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(TABS[0].key);
  const activeConfig = TABS.find(t => t.key === activeTab) ?? TABS[0];

  const {
    deliveries,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDeliveryPicList(activeTab, activeConfig.statuses);
  const { counts } = useDeliveryPicCounts();

  const { refreshControl } = useRefresh(async () => {
    await refetch();
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tabCounts = useMemo(() => {
    const map: Record<TabKey, number> = { sampai: 0, selesai: 0 };
    if (counts) {
      for (const tab of TABS) {
        map[tab.key] = tab.statuses.reduce(
          (sum, s) => sum + (counts[s] ?? 0),
          0,
        );
      }
    }
    return map;
  }, [counts]);

  const totalActive = tabCounts.sampai + tabCounts.selesai;

  const renderBody = () => {
    if (isError) return <ErrorState />;
    if (isLoading && deliveries.length === 0) return <LoadingState />;
    if (counts && totalActive === 0)
      return <EmptyState message="Belum ada tugas pengiriman" />;
    if (counts ? tabCounts[activeTab] === 0 : deliveries.length === 0)
      return <EmptyState message={activeConfig.emptyMessage} />;

    return (
      <FlatList
        data={deliveries}
        refreshControl={refreshControl}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetchingNextPage ? <LoadingState /> : null}
        renderItem={({ item }) => (
          <CardListData
            dnCode={item.dn_code}
            routeFrom={item.route_from}
            routeTo={item.route_to}
            updatedAt={item.updated_at}
            status={item.status}
            onPress={() => navigation.navigate(ROUTES.DN_DETAIL, { item })}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                active ? styles.tabActive : styles.tabInactive,
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  active ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label} · {tabCounts[tab.key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {renderBody()}
    </View>
  );
};

export default DataListPic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  tabInactive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  tabLabelInactive: {
    color: COLORS.textSecondary,
  },
});
