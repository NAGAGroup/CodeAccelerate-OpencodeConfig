// test/setup.ts
// Starts opencode serve using the naga-ollama profile via ocx

const SERVER_PORT = 4096;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

async function waitForServer(maxWaitMs = 20000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(`${SERVER_URL}/session`);
      if (res.ok || res.status === 200) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  // 1. Check if server already running
  try {
    const res = await fetch(`${SERVER_URL}/session`);
    if (res.ok) {
      console.log("✅ OpenCode server already running on port " + SERVER_PORT);
      return;
    }
  } catch {}

  // 2. Start opencode serve via ocx with naga-ollama profile (detached background process)
  console.log("Starting opencode serve with naga-ollama profile...");
  const proc = Bun.spawn(["ocx", "oc", "-p", "naga-ollama", "serve", "--port", String(SERVER_PORT)], {
    stdout: Bun.file("/tmp/opencode-serve.log"),
    stderr: Bun.file("/tmp/opencode-serve-err.log"),
    detached: true,
    cwd: process.env.OPENCODE_PROJECT_DIR ?? process.cwd(),
  });
  proc.unref();
  console.log(`Started PID: ${proc.pid}`);

  // 3. Wait for server to be ready
  const ready = await waitForServer(20000);
  if (!ready) {
    console.error("❌ Server did not start within 20 seconds");
    console.error("Check /tmp/opencode-serve.log and /tmp/opencode-serve-err.log");
    process.exit(1);
  }
  console.log("✅ OpenCode server ready (naga-ollama profile, port " + SERVER_PORT + ")");
}

main().catch(console.error);
