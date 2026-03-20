@echo off
cd /d "C:\Users\2240604\work\others\dev\claude_code_playground\my-website"
"C:\Program Files\nodejs\node.exe" scripts\schedule-tweet.mjs >> logs\schedule-tweet.log 2>&1
