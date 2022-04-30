export default {
  extensions: {
    ts: "module"
  },
  nodeArguments: [
    "--loader=esbuild-node-loader",
    "--experimental-specifier-resolution=node"
  ]
}
