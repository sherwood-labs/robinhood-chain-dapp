// Small wrapper around forge and cast. Both scripts in this folder use it
// so a missing Foundry install fails with the same message on Windows and macOS.
import { spawnSync } from "node:child_process";

export function run(command, args, { cwd } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      console.error(
        `${command} was not found. Install Foundry from https://getfoundry.sh and open a new terminal.`,
      );
    } else {
      console.error(result.error.message);
    }
    process.exit(1);
  }

  return {
    status: result.status ?? 1,
    stdout: (result.stdout ?? "").replace(/\r/g, ""),
    stderr: (result.stderr ?? "").replace(/\r/g, ""),
  };
}

export function must(command, args, opts) {
  const result = run(command, args, opts);
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exit(result.status);
  }
  return result;
}

export function combined(result) {
  return `${result.stdout}\n${result.stderr}`;
}
