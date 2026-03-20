# 編集部ルール

このディレクトリはブログ記事・下書きを管理する。
AIが記事を書く際はこのルールに従うこと。

## 文体・トーン

- 一人称は「私」
- 語尾は「です・ます」調（ただし箇条書きは体言止めでよい）
- 専門用語には初出時に簡単な説明を添える
- 読者は「AIに興味があるエンジニア・起業家」を想定

## 記事構成

- 冒頭に「この記事でわかること」を3行以内で書く
- 見出しは h2・h3 のみ使用（h4以下は使わない）
- コードブロックには必ず言語名を指定する
- 記事の最後に「まとめ」セクションを入れる

## ファイル命名規則

`YYYY-MM-DD-slug-name.mdx`
例: `2026-03-20-claude-code-hooks.mdx`

## メタデータ（frontmatter）必須項目

```
---
title: 記事タイトル
titleEn: Article Title in English
date: YYYY-MM-DD
category: engineering | business | finance | marketing
tags: [タグ1, タグ2]
summary: 1〜2文の要約
summaryEn: Summary in English
---
```

## ディレクトリ構成

- `blog/` — 公開済み記事
- `drafts/` — 執筆中（公開しない）
