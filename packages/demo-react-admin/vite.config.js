import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig, loadEnv } from "vite";
import path from "path";
import fs from "fs";

const packages = fs.readdirSync(path.resolve(__dirname, "../../packages"));
const aliases = packages.map((dirName) => {
  const packageJson = require(path.resolve(
    __dirname,
    "../../packages",
    dirName,
    "package.json"
  ));
  return {
    find: new RegExp(`^${packageJson.name}$`),
    replacement: path.resolve(
      __dirname,
      `../../packages/${packageJson.name}/src`
    ),
  };
}, {});

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [reactRefresh()],
    resolve: {
      alias: [
        ...aliases,
        {
          find: /^@mui\/icons-material\/(.*)/,
          replacement: "@mui/icons-material/esm/$1",
        },
      ],
    },
    server: {
      port: 8080,
      host: "0.0.0.0",
    },
    define: {
      "process.env.GOOGLE_CLIENT_ID": JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
    },
  };
});
