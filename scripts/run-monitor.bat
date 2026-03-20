@echo off
cd /d "C:\Users\2240604\work\others\dev\claude_code_playground\my-website"
echo [%date% %time%] 監視開始 >> logs\monitor.log
"C:\Program Files\nodejs\node.exe" scripts\monitor.mjs >> logs\monitor.log 2>&1
echo [%date% %time%] 監視完了 >> logs\monitor.log
