# Logout — Analisis & Fix (Supabase)

## TL;DR
Sebelumnya logout **tidak benar-benar sign-out dari Supabase**. Tombol "Keluar" memakai `logoutApi` **dummy** (cuma `delay(500ms)`) dari `features/settings/service/logoutService.ts`, padahal `logoutApi` **asli** (`supabase.auth.signOut()`) sudah ada di `features/login/services/authService.ts` tapi tidak dipakai.

---

## 1. Apa sudah sesuai Supabase? ❌ BELUM
Logout hanya:
- Clear state `AuthContext` (token/role/profile/isPinVerified)
- Navigasi ke Login

Sesi Supabase **tidak** di-revoke (server) dan **tidak** dihapus dari AsyncStorage (`persistSession: true`).

## 2. Alur (sebelum fix)
```
Tombol "Keluar"  (7 screen role + SettingScreens)
 └─► useLogout.handleLogout            features/settings/hooks/logoutHooks.tsx
      ├─ await logoutApi()             ← DUMMY: delay(500ms), BUKAN signOut
      ├─ logout()                      ← AuthContext bersihkan state lokal
      └─ navigation.reset(LOGIN)       ← balik ke halaman login
```
Kenapa **kelihatan** jalan padahal tidak benar: `RootNavigator` membaca `AuthContext` (bukan sesi Supabase). Context ke-clear → Login muncul. Tapi sesi Supabase masih nempel → bukan logout yang clean/secure.

Ada **dua** `logoutApi`:
| Lokasi | Isi | Dipakai? |
|---|---|---|
| `features/settings/service/logoutService.ts` | `delay(500)` (dummy) | ✅ oleh `useLogout` |
| `features/login/services/authService.ts` | `supabase.auth.signOut()` (real) | ❌ tidak dipakai |

## 3. Yang diubah (fix)
Konsolidasi ke `logoutApi` yang asli — tidak ada kode baru, cuma ganti sumber + hapus duplikat:

1. **`src/features/settings/hooks/logoutHooks.tsx`** — ganti import:
   ```diff
   -import { logoutApi } from '../service/logoutService';
   +import { logoutApi } from '../../login/services/authService';
   ```
   `handleLogout` tetap: `await logoutApi()` → `logout()` → `navigation.reset(LOGIN)`. Urutan ini benar (signOut Supabase + clear AuthContext + navigasi, semua dibutuhkan).

2. **Hapus `src/features/settings/service/logoutService.ts`** (dummy + helper `delay`). Sudah dicek tidak ada importer lain.

> Catatan teknis: `supabase.auth.signOut()` (v2) me-return `{ error }`, tidak melempar. `logoutApi` mengabaikan return-nya → selalu resolve → `handleLogout` lanjut clear+navigasi. `try/catch` di hook tetap aman sebagai safety net. Sesi lokal Supabase tetap di-clear walau revoke server gagal jaringan.

---

## Verifikasi
1. `npx tsc --noEmit` → exit 0.
2. Login → masuk role tab → tekan "Keluar".
   - Console: `signOut` tereksekusi tanpa error.
   - UI: balik ke Login.
   - AsyncStorage: sesi Supabase terhapus.
3. Login lagi dengan akun lain → sesi baru bersih (tidak bentrok sesi lama).

## Optional (di luar scope)
- **Session restore saat app dibuka:** sekarang `AuthContext` selalu mulai kosong walau Supabase punya sesi valid. Tambah `supabase.auth.onAuthStateChange` / `supabase.auth.getSession()` di `AuthProvider` kalau mau "ingat" user.
- **UX:** di `catch` `handleLogout` tambah `Alert` biar user tahu kalau gagal (sekarang cuma `console.log`).
