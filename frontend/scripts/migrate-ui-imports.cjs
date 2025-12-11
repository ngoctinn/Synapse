/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Migration Script - UI Imports Refactor
 *
 * Script tự động để migrate imports từ:
 * - @/shared/ui/dialog → @/shared/ui
 * - @/shared/ui/custom/dialog → @/shared/ui
 * - @/shared/ui/badge → @/shared/ui
 * - @/shared/ui/custom/status-badge → @/shared/ui
 *
 * Cách chạy:
 * cd frontend
 * node scripts/migrate-ui-imports.cjs
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Cấu hình
const DRY_RUN = process.argv.includes('--dry-run');

console.log('🚀 Bắt đầu migration UI imports...\n');
if (DRY_RUN) {
  console.log('⚠️  DRY RUN MODE - Không thực sự thay đổi file\n');
}

// Tìm tất cả .ts/.tsx files trong features
const files = glob.sync('src/features/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/*.d.ts'],
  cwd: path.join(__dirname, '..')
});

console.log(`📂 Tìm thấy ${files.length} files để kiểm tra\n`);

let modifiedCount = 0;
let errorCount = 0;

const migrations = [
  // Dialog migrations
  {
    pattern: /from\s+["']@\/shared\/ui\/dialog["']/g,
    replacement: 'from "@/shared/ui"',
    name: 'Dialog (primitive)'
  },
  {
    pattern: /from\s+["']@\/shared\/ui\/custom\/dialog["']/g,
    replacement: 'from "@/shared/ui"',
    name: 'CustomDialog'
  },

  // Badge migrations
  {
    pattern: /from\s+["']@\/shared\/ui\/badge["']/g,
    replacement: 'from "@/shared/ui"',
    name: 'Badge (primitive)'
  },
  {
    pattern: /from\s+["']@\/shared\/ui\/custom\/status-badge["']/g,
    replacement: 'from "@/shared/ui"',
    name: 'StatusBadge'
  },

  // Component name replacements (chỉ khi cần)
  // CustomDialog → Dialog (nếu code sử dụng CustomDialog explicitly)
  {
    pattern: /\bCustomDialog\b/g,
    replacement: 'Dialog',
    name: 'CustomDialog → Dialog (rename)',
    skipIfNoImport: true
  }
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    let fileModified = false;
    const changesApplied = [];

    migrations.forEach(migration => {
      const matches = content.match(migration.pattern);
      if (matches) {
        // Kiểm tra xem có import statement không (để tránh replace nhầm trong comment)
        if (migration.skipIfNoImport && !content.includes('from "@/shared/ui/custom/dialog"')) {
          return;
        }

        content = content.replace(migration.pattern, migration.replacement);
        changesApplied.push(`${migration.name} (${matches.length})`);
        fileModified = true;
      }
    });

    if (fileModified) {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`✏️  ${relativePath}`);
      changesApplied.forEach(change => {
        console.log(`   → ${change}`);
      });

      if (!DRY_RUN) {
        fs.writeFileSync(file, content, 'utf8');
      }

      modifiedCount++;
    }
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý file: ${file}`);
    console.error(error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ HOÀN TẤT MIGRATION');
console.log('='.repeat(60));
console.log(`📊 Thống kê:`);
console.log(`   - Files đã modify: ${modifiedCount}`);
console.log(`   - Files lỗi: ${errorCount}`);
console.log(`   - Tổng files kiểm tra: ${files.length}`);

if (DRY_RUN) {
  console.log('\n⚠️  Đây chỉ là DRY RUN. Chạy lại không có --dry-run để thực sự thay đổi files.');
}

console.log('\n📝 Bước tiếp theo:');
console.log('   1. Chạy TypeScript check: cd frontend && pnpm tsc --noEmit');
console.log('   2. Review thay đổi: git diff');
console.log('   3. Test thủ công các màn hình quan trọng');

process.exit(errorCount > 0 ? 1 : 0);
