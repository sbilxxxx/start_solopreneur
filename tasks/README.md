# タスク管理

## 構成

| ファイル | 役割 |
|---------|------|
| `current.md` | 今のスプリント（Claude が最初に見る） |
| `backlog/phase-N.md` | 各フェーズの未着手タスク一覧 |
| `done/` | 完了タスクのアーカイブ |

## ルール

- 着手したら `current.md` に移す
- 完了したら `done/YYYY-MM.md` にアーカイブ
- Claude に「次のタスクは？」と聞けば `current.md` を参照して答える
- GitHub Issues（Phase 2 以降）と連携予定
