import { sveltekit } from "@sveltejs/kit/vite";
/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ["poker-solver"],
    },
  },
};

export default config;
