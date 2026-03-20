# X自動化 技術設計

作成日: 2026-03-20

---

## 自動化の段階設計

### 現在（Phase 2）: 手動投稿 + AI生成

```
/marketing-post → 投稿文3パターン生成
→ 人間が選択・確認
→ Xアプリで手動投稿
→ marketing/sns/YYYY-MM.md にアーカイブ
```

**必要なもの:** なし（今すぐできる）

---

### Phase 3: 半自動（下書き自動生成）

```
ブログ記事公開（git push）
→ Stopフック が記事を検知
→ /marketing-post が自動起動
→ 投稿文を marketing/sns/drafts/ に保存
→ 人間が確認して投稿
```

**必要なもの:** Hooksの応用設定

---

### Phase 5: 完全自動（X API連携）

```
スケジューラー（毎週月水金）
→ drafts/ から投稿文を取得
→ X API v2 で自動投稿
→ エンゲージメントデータを取得
→ analytics/ に保存
→ 次の戦略に反映
```

**必要なもの:**
- X Developer Account（無料）
- X API v2 のキー（Free Tier: 月1,500投稿まで無料）
- 環境変数: `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`
- `src/app/api/tweet/route.ts`（投稿APIルート）

---

## X API 取得手順（Phase 5 の準備）

1. https://developer.twitter.com/en/portal/dashboard にアクセス
2. 「Create Project」→ アプリを作成
3. 「User authentication settings」で OAuth 1.0a を有効化
4. Keys and Tokens から4つのキーをコピー
5. Vercelの環境変数に設定

**注意:** Free Tierは読み取りAPIに制限あり。投稿（Write）は月1,500回まで無料。

---

## 当面のアクション（今週）

- [ ] Xアカウントのプロフィール整備（bio・ヘッダー画像）
- [ ] 最初の投稿: このサイトの紹介（`/marketing-post` で生成）
- [ ] 週3投稿のルーティン開始
