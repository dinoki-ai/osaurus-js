import { promises as fs } from "fs";
import path from "path";
import os from "os";

export interface OsaurusInstance {
  instanceId: string;
  updatedAt: number;
  address: string;
  port: number;
  url: string;
  exposeToNetwork: boolean;
}

export async function discover(): Promise<OsaurusInstance> {
  const base = path.join(
    os.homedir(),
    "Library",
    "Application Support",
    "com.dinoki.osaurus",
    "SharedConfiguration"
  );

  const entries = await fs.readdir(base, { withFileTypes: true }).catch(() => {
    throw new Error("Osaurus not found");
  });

  const candidates: OsaurusInstance[] = [];

  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue;

    const configPath = path.join(base, dirent.name, "configuration.json");

    try {
      const data = await fs.readFile(configPath, "utf8");
      const cfg = JSON.parse(data);

      if (cfg.health !== "running" || !cfg.port || !cfg.address) {
        continue;
      }

      const updatedAt =
        Date.parse(cfg.updatedAt) ||
        (await fs.stat(path.join(base, dirent.name))).mtimeMs;

      candidates.push({
        instanceId: cfg.instanceId,
        updatedAt,
        address: cfg.address,
        port: cfg.port,
        url: cfg.url || `http://${cfg.address}:${cfg.port}`,
        exposeToNetwork: !!cfg.exposeToNetwork,
      });
    } catch {
      continue;
    }
  }

  if (!candidates.length || !candidates[0]) {
    throw new Error("No running Osaurus instance found");
  }

  candidates.sort((a, b) => b.updatedAt - a.updatedAt);
  return candidates[0];
}

export default { discover };
