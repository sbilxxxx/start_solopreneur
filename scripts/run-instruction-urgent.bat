@echo off
cd /d "C:\Users\2240604\work\others\dev\claude_code_playground\my-website"
node scripts/agents/run-instruction.mjs --urgent >> logs/instruction-urgent.log 2>&1
