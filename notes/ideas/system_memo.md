**ボトルネック**

1. 状態管理の正本が分散しています。**content/blog**, **marketing/sns**, **tasks/current.md**, **logs/***, **GitHub Issues** に状態が散っていて、どれが最終判断基準か場面ごとに違います。結果として manager / instruction / Telegram / Web で認識ズレが起きやすいです。
2. エージェント実行が「起動型スクリプト」に寄っていて、ジョブ制御が弱いです。scripts/agents/run-manager.mjs と scripts/agents/run-instruction.mjs は単発実行前提で、重複起動防止、再実行制御、途中失敗の回復が薄いです。Task Scheduler や GitHub Actions で複数回走ると競合しやすいです。
3. 指示実行のキューが GitHub Issue ベースで粗いです。**instruction** ラベルで拾うだけなので、**queued/running/done/failed** の状態遷移が弱く、同じ issue を別ランナーが触る余地があります。**close = 完了** に寄せているため、監査しづらいです。
4. RAG が簡易すぎます。src/lib/rag.ts は毎回ブログ一覧を LLM に渡して関連 slug を選ばせています。記事数が増えると遅くなり、コストも増え、選定の再現性も下がります。
5. 外部 API 依存箇所にフェイルセーフが足りません。**Anthropic**, **X**, **Telegram**, **GitHub** を直接叩いていますが、レート制限、タイムアウト、リトライ、サーキットブレーク、部分失敗時の代替動作が薄いです。特に **/api/kpi** と Telegram webhook は外部失敗の影響を受けやすいです。
6. 文字化けが実装全体に見えます。ソース表示上、UI文言やコメントが壊れている箇所が多く、運用メッセージやプロンプトの品質低下につながります。これは指示精度、ブランド、一貫性の全部に効く地味に重い問題です。
7. 可観測性が不足しています。**logs/** と **cost-log.json** はありますが、ジョブ単位の **run_id**, 実行時間, 成否, 失敗理由, 対象 issue, 変更ファイル一覧が構造化されていません。障害時の原因追跡がしづらいです。
8. セキュリティ境界がやや曖昧です。Telegram webhook から GitHub Issue 作成、そこから instruction agent 実行という流れは便利ですが、「誰の指示が何を変えたか」の検証が弱いです。権限の強い **GITHUB_TOKEN** と自動実行が近い位置にあります。

**改善案**

1. 「単一の運用状態テーブル」を作るべきです。DB が重ければまずは **data/jobs.json** でもいいので、**job_id**, **source**, **type**, **status**, **issue_number**, **started_at**, **finished_at**, **result** を一元化します。GitHub Issue は UI、実際の状態は内部ジョブ台帳に寄せるのがいいです。
2. エージェント実行をジョブランナー化してください。各 agent は「直接全部やる」のではなく、
   * **enqueue**
   * **claim**
   * **execute**
   * **heartbeat**
   * **complete/fail**
     の流れに分けるべきです。最低限でも「実行中ロックファイル」か「GitHub issue に running ラベル付与」で二重実行防止を入れるべきです。
3. Issue 運用に状態遷移を入れてください。
   * **instruction:new**
   * **instruction:running**
   * **instruction:blocked**
   * **instruction:done**
   * **instruction:failed**
     のように分けると、運用がかなり読みやすくなります。**close** は完了の最終段階だけにすると監査しやすいです。
4. RAG は埋め込みベースに置き換えるべきです。今は PoC としては成立していますが、記事が増えると破綻します。**content/blog** 更新時に embedding を生成してローカル JSON か軽量 DB に保存し、問い合わせ時はベクトル近傍検索にすると速度・コスト・安定性が改善します。
5. 外部 API 呼び出しを共通クライアント化してください。**retry with backoff**, **timeout**, **structured error**, **rate limit handling** を **lib/clients/*** に寄せるべきです。今は route/script ごとに責務が散っています。
6. Telegram は「指示入力」と「承認操作」を分離した方が安全です。特に instruction 系は、
   * 受理
   * dry-run 要約返信
   * 明示承認
   * 実行
     の 4段階にすると事故が減ります。
7. ログを構造化してください。テキストログに加えて **logs/runs/*.json** を持ち、
   * agent
   * trigger
   * issue
   * files_changed
   * duration_ms
   * estimated_cost
   * final_status
     を残すだけで運用性がかなり上がります。
8. 文字コードを全ファイルで是正してください。これは優先度が高いです。UI文言、Telegram文言、プロンプトの品質が落ちると、UX とエージェント精度の両方を壊します。

**優先順位**
最初にやるべきなのはこの順です。

1. 文字化け修正
2. instruction/manager の二重実行防止
3. job 状態の一元化
4. 外部 API の共通リトライ/エラーハンドリング
5. RAG の埋め込み化
