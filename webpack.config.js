const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  []
);

module.exports = {
  output: {
    uniqueName: "myEcommerceApp",
    publicPath: "auto",
    scriptType: "text/javascript"   
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        profile: "profile@http://localhost:4201/remoteEntry.js" 
      },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: false, requiredVersion: "auto" }, 
        "@angular/common": { singleton: true, strictVersion: false, requiredVersion: "auto" }, 
        "@angular/common/http": { singleton: true, strictVersion: false, requiredVersion: "auto" }, 
        "@angular/router": { singleton: true, strictVersion: false, requiredVersion: "auto" },

        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ],
};
