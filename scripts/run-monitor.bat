@echo off
REM ============================================================
REM [DEPRECATED] Task Scheduler 版 — GitHub Actions に移行済み
REM
REM 移行先: .github/workflows/monitor.yml
REM スケジュール: 毎日 8:30 JST
REM
REM このファイルはフォールバック用（GitHub Actions が使えない場合のみ利用）
REM ============================================================

cd /d "C:\Users\2240604\work\others\dev\claude_code_playground\my-website"
echo [%date% %time%] 監視開始（ローカルフォールバック） >> logs\monitor.log
"C:\Program Files\nodejs\node.exe" scripts\monitor.mjs >> logs\monitor.log 2>&1
echo [%date% %time%] 監視完了 >> logs\monitor.log
