# HƯỚNG DẪN THỐNG NHẤT ENUMS - URGENT FIX

## Tình trạng hiện tại

Đã thống nhất:
- ✅ `appointments/types.ts` - AppointmentStatus type definition
- ✅ `appointments/constants.ts` - Status config và options

Cần sửa:
- ❌ `appointments/mock-data.ts` - Tất cả status values
- ❌ `appointments/actions.ts` - Status comparisons và assignments
- ❌ `appointments/components/**/*.tsx` - Tất cả components
- ❌ `billing/actions.ts` - membershipLevel comparisons
- ❌ `customer-dashboard/types.ts` - AppointmentStatus type

## Lệnh sửa nhanh (Git Bash)

```bash
cd frontend/src/features

# Fix AppointmentStatus
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e 's/"pending"/"PENDING"/g' \
  -e 's/"confirmed"/"CONFIRMED"/g' \
  -e 's/"in_progress"/"IN_PROGRESS"/g' \
  -e 's/"completed"/"COMPLETED"/g' \
  -e 's/"cancelled"/"CANCELLED"/g' \
  -e 's/"no_show"/"NO_SHOW"/g' \
  -e "s/'pending'/'PENDING'/g" \
  -e "s/'confirmed'/'CONFIRMED'/g" \
  -e "s/'in_progress'/'IN_PROGRESS'/g" \
  -e "s/'completed'/'COMPLETED'/g" \
  -e "s/'cancelled'/'CANCELLED'/g" \
  -e "s/'no_show'/'NO_SHOW'/g" \
  {} +

# Fix MembershipLevel
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e 's/membershipLevel: "regular"/membershipLevel: "REGULAR"/g' \
  -e 's/membershipLevel: "silver"/membershipLevel: "SILVER"/g' \
  -e 's/membershipLevel: "gold"/membershipLevel: "GOLD"/g' \
  -e 's/membershipLevel: "platinum"/membershipLevel: "PLATINUM"/g' \
  -e "s/membershipLevel === 'gold'/membershipLevel === 'GOLD'/g" \
  -e "s/membershipLevel === 'platinum'/membershipLevel === 'PLATINUM'/g" \
  {} +

echo "✓ Done! Run 'pnpm typecheck' to verify"
```

## Hoặc dùng VSCode Find & Replace (Regex mode)

### Pattern 1: Status values
```
Find: "(pending|confirmed|in_progress|completed|cancelled|no_show)"
Replace: "$1" → UPPERCASE manually
```

### Pattern 2: Membership levels
```
Find: membershipLevel: "(regular|silver|gold|platinum)"
Replace: membershipLevel: "UPPERCASE"
```

## Verification

```bash
cd frontend
pnpm typecheck  # Should show 0 errors
pnpm lint       # Should pass
```

## Files cần kiểm tra sau khi sửa

1. `appointments/mock-data.ts` - ~30 occurrences
2. `appointments/actions.ts` - ~10 occurrences
3. `appointments/components/appointments-page.tsx` - ~5 occurrences
4. `billing/actions.ts` - 2 occurrences
5. `customer-dashboard/types.ts` - 1 type definition

## Expected Result

Sau khi chạy xong:
- 0 TypeScript errors
- Tất cả status values đều UPPERCASE
- Khớp 100% với database enum definitions
