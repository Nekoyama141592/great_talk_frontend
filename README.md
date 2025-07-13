# GreatTalk Frontend

GreatTalk Apps のフロントエンド Web アプリケーション - AI 統合ソーシャルプラットフォームの React/TypeScript 実装

## 📋 目次

- [プロジェクト概要](#プロジェクト概要)
- [技術スタック](#技術スタック)
- [アーキテクチャ](#アーキテクチャ)
- [開発環境セットアップ](#開発環境セットアップ)
- [利用可能なスクリプト](#利用可能なスクリプト)
- [プロジェクト構造](#プロジェクト構造)
- [開発ガイドライン](#開発ガイドライン)
- [テスト](#テスト)
- [デプロイ](#デプロイ)
- [トラブルシューティング](#トラブルシューティング)

## 🚀 プロジェクト概要

GreatTalk Frontend は ShareAI エコシステムの一部として開発された、モダンな React/TypeScript Web アプリケーションです。ユーザーが投稿を作成し、AI エージェントと対話し、コミュニティと交流できる AI 統合ソーシャルプラットフォームを提供します。

### 主な機能

- **ユーザー認証**: Firebase Auth による Google ログイン
- **投稿管理**: 投稿の作成・表示・検索
- **ユーザー管理**: プロフィール表示・ユーザー一覧
- **リアルタイム通信**: Firebase Firestore によるリアルタイムデータ同期
- **レスポンシブデザイン**: Tailwind CSS による美しい UI
- **型安全性**: TypeScript による堅牢な型システム

## 🛠 技術スタック

### Core Technologies

- **React 18** - モダンなReactフレームワーク
- **TypeScript** - 静的型付けによる開発効率向上
- **Vite** - 高速なビルドツール・開発サーバー

### State Management & Data Fetching

- **Jotai** - 軽量でスケーラブルな状態管理
- **TanStack React Query** - サーバー状態管理とキャッシング
- **SWR** - フォールバック用データ取得ライブラリ

### UI & Styling

- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **Material-UI (MUI)** - Reactコンポーネントライブラリ
- **React Icons** - アイコンコンポーネント集

### Backend & Infrastructure

- **Firebase Suite**:
  - Firebase Auth - 認証システム
  - Cloud Firestore - NoSQLデータベース
  - Firebase Storage - ファイルストレージ
  - Firebase Hosting - ホスティング

### Development Tools

- **ESLint** - コード品質管理
- **Prettier** - コードフォーマッター
- **Vitest** - 高速テストランナー
- **React Testing Library** - Reactコンポーネントテスト

## 🏗 アーキテクチャ

### Feature-Based Architecture

プロジェクトは機能ベースのアーキテクチャを採用し、各機能ごとにモジュール化されています。

```
src/
├── atoms/                    # グローバル状態管理
├── features/                 # 機能別ディレクトリ
│   ├── auth/                # 認証機能
│   │   ├── atoms/           # 認証状態管理
│   │   └── components/      # 認証コンポーネント
│   ├── posts/               # 投稿機能
│   │   ├── atoms/           # 投稿状態管理
│   │   └── components/      # 投稿コンポーネント
│   ├── users/               # ユーザー機能
│   │   ├── atoms/           # ユーザー状態管理
│   │   └── components/      # ユーザーコンポーネント
│   └── shared/              # 共有リソース
│       ├── common/          # 共通コンポーネント
│       ├── infrastructures/ # Firebase設定
│       ├── pages/           # ページコンポーネント
│       └── schema/          # TypeScript型定義
└── test/                    # テスト設定とユーティリティ
```

### 設計原則

- **機能分離**: 各機能は独立したディレクトリで管理
- **型安全性**: TypeScript による厳密な型チェック
- **コンポーネント化**: 再利用可能なコンポーネント設計
- **絶対パス**: パスエイリアスによる保守性向上
- **テスト駆動**: 包括的なテストカバレッジ

## 🚦 開発環境セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm 9.0.0 以上
- Firebase プロジェクト設定

### インストール手順

1. **リポジトリのクローン**

```bash
git clone <repository-url>
cd great_talk_frontend
```

2. **依存関係のインストール**

```bash
npm install
```

3. **Firebase設定**

```bash
# Firebase プロジェクトの設定ファイルを配置
# src/features/shared/infrastructures/firebase.ts を確認
```

4. **開発サーバーの起動**

```bash
npm run dev
```

アプリケーションは `http://localhost:5173` で利用可能になります。

## 📜 利用可能なスクリプト

### 開発

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド済みアプリのプレビュー
```

### テスト

```bash
npm run test         # テストをウォッチモードで実行
npm run test:run     # テストを1回実行
npm run test:ui      # テストUIでテスト実行
npm run test:coverage # カバレッジ付きでテスト実行
```

### コード品質

```bash
npm run lint         # 全てのリンティングチェック実行
npm run lint:tsc     # TypeScript型チェック
npm run lint:eslint  # ESLintチェック
npm run lint:prettier # Prettierフォーマットチェック

npm run fix          # 全ての修正可能な問題を自動修正
npm run fix:prettier # Prettierで自動フォーマット
npm run fix:eslint   # ESLintで自動修正
```

## 📁 プロジェクト構造

### パスエイリアス

開発効率向上のため、以下のパスエイリアスを設定しています：

```typescript
'@/*'      → 'src/*'
'@atoms/*' → 'src/atoms/*'
'@shared/*' → 'src/features/shared/*'
'@auth/*'   → 'src/features/auth/*'
'@posts/*'  → 'src/features/posts/*'
'@users/*'  → 'src/features/users/*'
```

### 主要なファイル

| ファイル/ディレクトリ                             | 説明                                 |
| ------------------------------------------------- | ------------------------------------ |
| `src/features/shared/main.tsx`                    | アプリケーションエントリーポイント   |
| `src/features/shared/pages/App.tsx`               | メインアプリケーションコンポーネント |
| `src/features/shared/pages/router/`               | React Router設定                     |
| `src/atoms/`                                      | グローバル状態管理                   |
| `src/features/shared/infrastructures/firebase.ts` | Firebase設定                         |
| `src/test/setup.ts`                               | テスト環境設定                       |
| `vite.config.ts`                                  | Vite設定（パスエイリアス含む）       |

## 🎯 開発ガイドライン

### コード規約

1. **TypeScript**: 厳密な型定義を使用
2. **コンポーネント**: 名前付きexportとアロー関数を使用
3. **スタイル**: Tailwind CSSクラスを活用
4. **状態管理**: Jotai atomsを適切に使用
5. **テスト**: 新機能には必ずテストを追加

### コンポーネント作成例

```typescript
// src/features/example/components/ExampleComponent.tsx
import React from 'react'

interface ExampleComponentProps {
  title: string
  onClick?: () => void
}

export const ExampleComponent = ({ title, onClick }: ExampleComponentProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      {onClick && (
        <button
          onClick={onClick}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          クリック
        </button>
      )}
    </div>
  )
}
```

### 状態管理例

```typescript
// src/features/example/atoms/index.ts
import { atom } from 'jotai'

export interface ExampleState {
  count: number
  isLoading: boolean
}

export const exampleAtom = atom<ExampleState>({
  count: 0,
  isLoading: false,
})

export const incrementAtom = atom(null, (get, set) => {
  const current = get(exampleAtom)
  set(exampleAtom, { ...current, count: current.count + 1 })
})
```

## 🧪 テスト

### テスト戦略

- **ユニットテスト**: 個別コンポーネントのテスト
- **統合テスト**: 複数コンポーネント間の連携テスト
- **E2Eテスト**: ユーザーフロー全体のテスト

### テスト作成例

```typescript
// src/features/example/components/ExampleComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExampleComponent } from './ExampleComponent'

describe('ExampleComponent', () => {
  it('タイトルが正しく表示される', () => {
    render(<ExampleComponent title="テストタイトル" />)
    expect(screen.getByText('テストタイトル')).toBeInTheDocument()
  })

  it('クリックイベントが正しく動作する', () => {
    const handleClick = vi.fn()
    render(<ExampleComponent title="テスト" onClick={handleClick} />)

    fireEvent.click(screen.getByText('クリック'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### モック設定

Firebase、React Query、Jotaiなどの外部依存関係は自動的にモックされます。カスタムモックが必要な場合は `src/test/setup.ts` を編集してください。

## 🚀 デプロイ

### プロダクションビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### Firebase Hosting

```bash
# Firebase CLIを使用したデプロイ
firebase deploy --only hosting
```

### 環境変数

本番環境では以下の環境変数を設定してください：

- Firebase設定（API Key、Project ID等）
- 環境固有の設定値

## 🔧 トラブルシューティング

### よくある問題

#### 1. インポートエラー

```
Module not found: Can't resolve '@shared/...'
```

**解決方法**: TypeScript設定を確認し、パスエイリアスが正しく設定されているか確認

#### 2. Firebase接続エラー

```
Firebase: No Firebase App '[DEFAULT]' has been created
```

**解決方法**: Firebase設定ファイルが正しく配置されているか確認

#### 3. テスト実行エラー

```
TypeError: Cannot read properties of undefined
```

**解決方法**: モック設定を確認し、必要な依存関係がモックされているか確認

### デバッグ手順

1. **開発者ツール**: ブラウザの開発者ツールでエラーを確認
2. **ログ出力**: `console.log` を使用してデバッグ情報を出力
3. **型チェック**: `npm run lint:tsc` でTypeScriptエラーを確認
4. **依存関係**: `npm install` で依存関係を再インストール

## 📞 サポート

### ドキュメント

- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [Firebase公式ドキュメント](https://firebase.google.com/docs)

### 貢献

プロジェクトへの貢献を歓迎します。プルリクエストを送信する前に：

1. コードフォーマットを実行: `npm run fix`
2. テストを実行: `npm run test:run`
3. ビルドを確認: `npm run build`

---

**Version**: 0.0.0  
**Last Updated**: 2024年  
**License**: Private

このプロジェクトは GreatTalk Apps エコシステムの一部として開発されています。
