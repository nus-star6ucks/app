/**
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'Star6ucks',
  productName: 'Star6ucks',
  copyright: 'Copyright © 2022 ${author}',
  asar: false,
  directories: {
    output: 'release/${version}',
    buildResources: 'resources',
  },
  files: [
    "**/*",
    "!**/*.ts",
    "!*.map",
    "!package.json",
    "!package-lock.json"
  ],
  extraFiles: ['libraries'],
  extraResources: [
    {
      "from": "dist",
      "to": "app",
      "filter": [
        "**/*"
      ]
    }
  ],
  files: ['dist'],
  win: {
    target: [
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
    artifactName: '${productName}-${version}-Setup.${ext}',
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ['dmg'],
    artifactName: '${productName}-${version}-Installer.${ext}',
  },
  linux: {
    target: ['AppImage'],
    artifactName: '${productName}-${version}-Installer.${ext}',
  },
}
