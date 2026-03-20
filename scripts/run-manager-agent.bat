@echo off
cd /d "C:\Users\2240604\work\others\dev\claude_code_playground\my-website"
echo [%date% %time%] manager-agent 起動 >> logs\manager-agent.log
"C:\Program Files\nodejs\node.exe" scripts\agents\run-manager.mjs >> logs\manager-agent.log 2>&1
echo [%date% %time%] manager-agent 完了 >> logs\manager-agent.log
