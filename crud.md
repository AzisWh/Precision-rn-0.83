# CRUD Supabase — Contoh mengikuti struktur code saat ini

Dokumen ini pakai contoh **delivery data** (tabel `delivery_table`, tipe `DeliveryNote`) supaya nyambung dengan kode yang sudah ada (`features/home/services/HomeService.tsx`, `features/home/type/home.ts`).

---

## Struktur folder per fitur (pola yang sudah dipakai)
```
src/features/<fitur>/
 ├─ type/        → tipe request/response (CreateXRequest, dst.)
 ├─ services/    → service.ts: panggilan supabase.from(...)
 ├─ hooks/       → useMutation.tsx: bungkus service dengan @tanstack/react-query
 └─ screens/ / components/
```
Aturan yang konsisten di codebase:
- Service me-return `ApiResponse<T>` (`{ status, message, data }`) dari `src/type/api.ts`.
- Error dilempar sebagai `ApiError` (`{ status, message }`).
- `supabase` diimport dari `../../../lib/supabase`.
- Tanpa generated types → hasil supabase di-cast `as <Tipe>` (kalau mau full safety, generate tipe Supabase).
- `console.log` untuk devtools (sukses ❌/✅), user lihat pesan bersih.

---

## 1. Tipe request (`features/delivery/type/delivery.ts`)
```typescript
import { DeliveryNote } from '../../home/type/home';

export type CreateDeliveryRequest = {
  dn_code: string;
  route_from: string;
  route_to: string;
  recipient: string;
  delivery_type: DeliveryNote['delivery_type']; // 'document' | 'vehicle' | 'package' | 'standard'
};

export type UpdateDeliveryRequest = Partial<CreateDeliveryRequest> & {
  status?: DeliveryNote['status']; // 'in_transit' | 'pending' | 'completed' | 'dispatched'
};
```

## 2. Service CRUD (`features/delivery/services/deliveryService.ts`)
```typescript
import { supabase } from '../../../lib/supabase';
import { ApiResponse } from '../../../type/api';
import { DeliveryNote } from '../../home/type/home';
import {
  CreateDeliveryRequest,
  UpdateDeliveryRequest,
} from '../type/delivery';

// ---- CREATE ----
export const createDelivery = async (
  req: CreateDeliveryRequest,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .insert(req)            // insert objek field sesuai kolom tabel
    .select()               // balikin row yang baru dibuat
    .single();

  if (error) {
    console.log('❌ createDelivery error:', error.message);
    throw { status: 500, message: error.message };
  }

  console.log('✅ createDelivery success:', data);
  return { status: 200, message: 'Delivery dibuat', data: data as DeliveryNote };
};

// ---- UPDATE ----
export const updateDelivery = async (
  id: string,
  req: UpdateDeliveryRequest,
): Promise<ApiResponse<DeliveryNote>> => {
  const { data, error } = await supabase
    .from('delivery_table')
    .update(req)            // update field (Partial) — hanya kolom yang dikirim
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.log('❌ updateDelivery error:', error.message);
    throw { status: 500, message: error.message };
  }

  console.log('✅ updateDelivery success:', data);
  return { status: 200, message: 'Delivery diperbarui', data: data as DeliveryNote };
};

// ---- DELETE ----
export const deleteDelivery = async (
  id: string,
): Promise<ApiResponse<{ id: string }>> => {
  const { error } = await supabase
    .from('delivery_table')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('❌ deleteDelivery error:', error.message);
    throw { status: 500, message: error.message };
  }

  console.log('✅ deleteDelivery success:', id);
  return { status: 200, message: 'Delivery dihapus', data: { id } };
};
```

## 3. Hooks (`features/delivery/hooks/deliveryMutation.tsx`)
Ikuti pola `loginMutation.tsx`. Pakai `useQueryClient` untuk invalidate list setelah mutasi.
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../type/api';
import {
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from '../services/deliveryService';
import {
  CreateDeliveryRequest,
  UpdateDeliveryRequest,
} from '../type/delivery';

// sesuaikan dengan queryKey yang dipakai useQuery list delivery
const DELIVERY_KEYS = ['deliveries'] as const;

export const useCreateDeliveryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ReturnType<typeof createDelivery>, ApiError, CreateDeliveryRequest>({
    mutationFn: createDelivery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DELIVERY_KEYS }),
  });
};

export const useUpdateDeliveryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...req }: { id: string } & UpdateDeliveryRequest) =>
      updateDelivery(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DELIVERY_KEYS }),
  });
};

export const useDeleteDeliveryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ReturnType<typeof deleteDelivery>, ApiError, string>({
    mutationFn: deleteDelivery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DELIVERY_KEYS }),
  });
};
```

## 4. Pakai di komponen
```typescript
import { Alert } from 'react-native';
import {
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
} from '../hooks/deliveryMutation';

// CREATE
const createMut = useCreateDeliveryMutation();
createMut.mutate(
  { dn_code: 'DN-001', route_from: 'Gudang A', route_to: 'Kantor B', recipient: 'John', delivery_type: 'package' },
  {
    onSuccess: res => console.log('dibuat:', res.data),
    onError: err => Alert.alert('Gagal', err.message),
  },
);

// UPDATE
const updateMut = useUpdateDeliveryMutation();
updateMut.mutate({ id: 'xxxx-xxxx', status: 'in_transit', recipient: 'Jane' });

// DELETE
const deleteMut = useDeleteDeliveryMutation();
deleteMut.mutate('xxxx-xxxx');
```

---

## 5. Get data profile berdasarkan user yang login

Di kode sekarang, data profile (`full_name`, `phone`, `role`) sudah disimpan ke `AuthContext` pas login (lihat `loginMutation.tsx` → `setProfile(...)`). Tapi field `id`-nya kosong (`id: ''`) karena `loginApi` belum ngembaliin id. Jadi kalau butuh **GET fresh** profile orang yang lagi login (misal di screen Profile/Settings), ambil id-nya langsung dari session Supabase, bukan dari context.

### Cara ambil id user yang login
```typescript
import { supabase } from '../../../lib/supabase';

const {
  data: { user },
} = await supabase.auth.getUser();
// user?.id  → id user yang lagi login (auth.uid() di RLS)
```

### Service (`features/profile/services/profileService.ts`)
Pakai pola yang sama: service return `ApiResponse<T>`, error jadi `ApiError`, hasil di-cast `as <Tipe>`.
```typescript
import { supabase } from '../../../lib/supabase';
import { ApiResponse } from '../../../type/api';
import { ApiError } from '../../../type/api';
import { UserProfile } from '../../login/type/auth';

export const getMyProfile = async (): Promise<ApiResponse<UserProfile>> => {
  // 1) ambil user yang lagi login dari session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('❌ getMyProfile: belum login');
    throw { status: 401, message: 'Belum login' } as ApiError;
  }

  // 2) ambil baris profile di user_table berdasarkan id itu
  const { data, error } = await supabase
    .from('user_table')
    .select('id, phone, full_name, role, is_active')
    .eq('id', user.id)       // filter = user yang login
    .single();               // pasti 1 row (id unik)

  if (error || !data) {
    console.log('❌ getMyProfile error:', error?.message);
    throw { status: 404, message: 'Profil tidak ditemukan' } as ApiError;
  }

  console.log('✅ getMyProfile success:', data);
  return { status: 200, message: 'Profil ditemukan', data: data as UserProfile };
};
```

### Hook (`features/profile/hooks/useProfile.tsx`)
GET dipakai berkali-kali → pakai `useQuery` (bukan `useMutation`).
```typescript
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../../type/api';
import { getMyProfile } from '../services/profileService';

export const useMyProfile = () =>
  useQuery<ReturnType<typeof getMyProfile>, ApiError>({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, // cache 5 menit, nggak refetch terus
  });
```

### Pakai di komponen
```typescript
import { useMyProfile } from '../hooks/useProfile';

const { data, isLoading, isError, error } = useMyProfile();

if (isLoading) return <Text>Memuat...</Text>;
if (isError) return <Text>{error.message}</Text>;

const profile = data.data; // { id, phone, full_name, role, is_active }
return <Text>Halo, {profile.full_name} ({profile.role})</Text>;
```

### Alternatif cepat (tanpa fetch ulang)
Kalau cuma butuh data yang udah ada pas login dan nggak butuh fresh:
```typescript
import { useAuth } from '../../context/AuthContext';

const { auth } = useAuth();
const profile = auth.profile; // { id, phone, full_name, role, is_active }
```
Tapi ingat `auth.profile.id` masih kosong sampai `loginApi`/`loginMutation` diperbaiki untuk ngisi `id` dari `authData.user.id`.

### RLS untuk SELECT profile sendiri
SELECT juga butuh policy biar user cuma bisa baca row-nya sendiri (kalau tabel diproteksi):
```sql
CREATE POLICY "read_own_profile"
  ON user_table FOR SELECT TO authenticated
  USING (auth.uid() = id);
```

---

## ⚠️ RLS wajib untuk INSERT / UPDATE / DELETE
SELECT saja tidak cukup. Tambah policy di SQL Editor Supabase (ingat pelajaran recursion: **jangan query tabel sendiri di dalam policy**):
```sql
-- contoh: user hanya bisa utak-atik row miliknya (asumsi ada kolom user_id / driver_id)
CREATE POLICY "owner_insert"  ON delivery_table FOR INSERT TO authenticated WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "owner_update"  ON delivery_table FOR UPDATE TO authenticated USING (auth.uid() = driver_id) WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "owner_delete"  ON delivery_table FOR DELETE TO authenticated USING (auth.uid() = driver_id);
```
Kalau error `42P17 infinite recursion` → ada policy yang query `delivery_table` di dalam dirinya sendiri; ubah jadi function `SECURITY DEFINER` (lihat catatan di chat).

## Tips
- `.select().single()` → balik 1 row (error kalau 0/banyak). Untuk mungkin-kosong pakai `.maybeSingle()`.
- `update()`/`insert()` terima **objek parsial** — kirim field yang relevan saja.
- Cast `as DeliveryNote` karena belum ada generated types. Kalau mau aman penuh: `supabase gen types typescript` lalu `createClient<Database>(...)`.

