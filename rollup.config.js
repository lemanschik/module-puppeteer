const rollupPluginNodeResolve = await import('@rollup/plugin-node-resolve');
const rollupConfig = [{ 
  input: {
    "puppeteer-esm": "puppeteer-core/lib/esm/puppeteer-core.js",
  },
  plugins:[
    rollupPluginNodeResolve(),
  ],
  output: [
    { format: "esm", dir: "./" },
  ],
}];

export default rollupConfig;
