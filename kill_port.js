
import { exec } from 'node:child_process';

const port = 3001;

if (process.platform === 'win32') {
  exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
    if (err) {
      console.log('No process found on port ' + port);
      return;
    }
    const lines = stdout.trim().split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid) {
        console.log(`Killing PID ${pid} on port ${port}`);
        exec(`taskkill /F /PID ${pid}`, (kErr, kStdout) => {
          if (kErr) console.error('Failed to kill:', kErr);
          else console.log('Killed:', kStdout.trim());
        });
      }
    });
  });
} else {
  // Linux/Mac
  exec(`lsof -i :${port} -t`, (err, stdout) => {
    if (err) {
      console.log('No process found on port ' + port);
      return;
    }
    const pids = stdout.trim().split('\n');
    pids.forEach(pid => {
      if (pid) {
         console.log(`Killing PID ${pid} on port ${port}`);
         exec(`kill -9 ${pid}`, (kErr) => {
            if (kErr) console.error('Failed to kill:', kErr);
            else console.log('Killed ' + pid);
         });
      }
    });
  });
}
