const fs = require('fs')
const minimist = require('minimist')
const compareVersions = require('compare-versions')
const args = process.argv.splice(process.execArgv.length + 2)
const argsv = minimist(args)
function versionBreakdown(version) {
  const array = version.split('.')
  return {
    major: Number(array[0]),
    minor: Number(array[1]),
    build: Number(array[2]),
  }
}
let currentVersion = fs.readFileSync(__dirname + '/../version', {
  encoding: 'utf-8',
})
currentVersion = currentVersion.trim()
let targetVersion = argsv.v

if (targetVersion) {
  if (!compareVersions(targetVersion, currentVersion)) {
    throw new Error('目标版本必须大于当前版本')
  }
} else {
  curVersionBreakdown = versionBreakdown(currentVersion)
  targetVersion = [
    curVersionBreakdown.major,
    curVersionBreakdown.minor,
    curVersionBreakdown.build + 1,
  ].join('.')
}
let packageJSON = fs.readFileSync(__dirname + '/../package.json', {
  encoding: 'utf-8',
})
packageJSON = JSON.parse(packageJSON)
packageJSON.version = targetVersion
fs.writeFileSync(
  __dirname + '/../package.json',
  JSON.stringify(packageJSON, null, 2),
  {encoding: 'utf-8'}
)
fs.writeFileSync(__dirname + '/../version', targetVersion)
return false
