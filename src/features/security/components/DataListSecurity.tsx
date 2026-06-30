import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ROUTES } from '../../../routes';
import useRefresh from '../../../shared/hooks/useRefresh';
import useDeliveryTable from '../../home/hooks/useDeliveryHooks';
import { useMemo, useState } from 'react';
import { DeliveryNote } from '../../delivery-detail/type';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/StateComponents';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CardListData from '../../../components/CardListData';
import { COLORS } from '../../../constant/color';
import { useNavigation } from '@react-navigation/native';

type TabKey = 'berjalan' | 'selesai';

type TabConfig = {
  key: TabKey;
  label: string;
  statuses: DeliveryNote['status'][];
  emptyMessage: string;
};

const TABS: TabConfig[] = [
  {
    key: 'berjalan',
    label: 'Berjalan',
    statuses: ['in_transit'],
    emptyMessage: 'Tidak ada pengiriman berjalan',
  },
  {
    key: 'selesai',
    label: 'Selesai',
    statuses: ['completed', 'arrived'],
    emptyMessage: 'Belum ada pengiriman selesai',
  },
];

const DataListSecurity = () => {
  const { deliveryNotes: deliveries, isLoading, isError, refetch } =
    useDeliveryTable({ includeCompleted: true });
  const { refreshControl } = useRefresh(async () => {
    await refetch();
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabKey>(TABS[0].key);

  const counts = useMemo(() => {
    const map: Record<TabKey, number> = { berjalan: 0, selesai: 0 };
    for (const d of deliveries) {
      const tab = TABS.find(t => t.statuses.includes(d.status));
      if (tab) map[tab.key] += 1;
    }
    return map;
  }, [deliveries]);

  const activeConfig = TABS.find(t => t.key === activeTab) ?? TABS[0];

  const tabDeliveries = useMemo(
    () => deliveries.filter(d => activeConfig.statuses.includes(d.status)),
    [deliveries, activeConfig],
  );

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (deliveries.length === 0)
    return <EmptyState message="Belum ada tugas pengiriman" />;

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
                {tab.label} · {counts[tab.key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tabDeliveries.length === 0 ? (
        <EmptyState message={activeConfig.emptyMessage} />
      ) : (
        <FlatList
          data={tabDeliveries}
          refreshControl={refreshControl}
          keyExtractor={item => item.id}
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
      )}
    </View>
  );
};

export default DataListSecurity;

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
