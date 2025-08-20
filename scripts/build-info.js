#!/usr/bin/env node

/**
 * 构建信息和性能监控脚本
 * 用于监控构建时间和缓存命中率
 */

import { execSync } from 'child_process'
import { statSync } from 'fs'
import { join } from 'path'

const packages = ['shared', 'db', 'api', 'cms']
const packagesDir = './packages'

console.log('📊 Monorepo Build Information\n')

// 检查包的构建状态
packages.forEach((pkg) => {
  const pkgPath = join(packagesDir, pkg)
  const distPath = join(pkgPath, 'dist')
  const tsConfigPath = join(pkgPath, 'tsconfig.json')

  console.log(`📦 @hono-payload/${pkg}:`)

  try {
    const distStat = statSync(distPath)
    const tsConfigStat = statSync(tsConfigPath)

    const isOutdated = tsConfigStat.mtime > distStat.mtime
    console.log(`   ✅ Built: ${distStat.mtime.toLocaleString()}`)
    console.log(
      `   ${isOutdated ? '🔄' : '✅'} Status: ${isOutdated ? 'Needs rebuild' : 'Up to date'}`,
    )
  } catch (e) {
    console.log(`   ❌ Not built`)
  }

  console.log('')
})

// 检查 TypeScript 项目引用状态
console.log('🔗 TypeScript Project References:')
try {
  const result = execSync('tsc --build --dry --verbose', { encoding: 'utf8' })
  console.log('   ✅ All references configured correctly')
} catch (e) {
  console.log('   ⚠️  Issues with project references')
  console.log(`   ${e.message.split('\n')[0]}`)
}

console.log('\n💡 Available optimized commands:')
console.log('   pnpm build              # Smart build with ultra-runner')
console.log('   pnpm build:incremental  # TypeScript incremental build')
console.log('   pnpm type-check         # Type check without emit')
console.log('   pnpm clean              # Clean all build artifacts')
