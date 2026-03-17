#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const dir = `c:\\Users\\abdel\\Desktop\\تهنئة العيد`;
process.chdir(dir);

const commands = [
  { cmd: 'git', args: ['add', '-A'], desc: 'git add -A' },
  { 
    cmd: 'git', 
    args: ['commit', '-m', `feat: short greet links /g/:shortId stored in MongoDB

- Add GreetLink model with shortId, templateImage, font, etc.
- POST /company/greet-links (auth) creates short link, returns shortId
- GET /company/greet-links/:shortId (public) returns full settings
- Add /g/:shortId route to App.jsx
- GreetPage now fetches all settings from API by shortId
- Fix canvas image loading: use offscreen canvas + encodeURI
- Fix template not found for custom/DB templates
- EmployeeLinkView saves to backend and generates clean short URL

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`],
    desc: 'git commit'
  },
  { cmd: 'git', args: ['push'], desc: 'git push' }
];

for (const command of commands) {
  console.log(`\n=== Running ${command.desc} ===`);
  const result = spawnSync(command.cmd, command.args, {
    cwd: dir,
    encoding: 'utf-8',
    stdio: 'inherit',
    shell: true
  });

  if (result.error) {
    console.error(`❌ Error running ${command.desc}:`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`❌ ${command.desc} exited with code ${result.status}`);
    process.exit(1);
  }
}

console.log('\n✅ All git commands completed successfully!');
