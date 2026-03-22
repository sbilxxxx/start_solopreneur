@echo off
REM ============================================================
REM [DEPRECATED] Task Scheduler 版 — GitHub Actions に移行済み
REM
REM 移行先: .github/workflows/tweet-schedule.yml
REM スケジュール:
REM   月曜 8:00 JST / 水曜 12:00 JST / 金曜 19:00 JST
REM
REM このファイルはフォールバック用（GitHub Actions が使えない場合のみ利用）
REM ============================================================

cd /d "C:\Users\2240604\work\others\dev\claude_code_playground\my-website"
echo [%date% %time%] schedule-tweet 実行（ローカルフォールバック） >> logs\schedule-tweet.log
"C:\Program Files\nodejs\node.exe" scripts\schedule-tweet.mjs >> logs\schedule-tweet.log 2>&1
echo [%date% %time%] 完了 >> logs\schedule-tweet.log
