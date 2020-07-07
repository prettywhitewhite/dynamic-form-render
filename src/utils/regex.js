function getMatches(string, regex, index = 1) {
  const matches = []
  let match
  match = regex.exec(string)
  while (match) {
    matches.push(match[index])
    match = regex.exec(string)
  }
  return matches
}

function escapeRegex(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
}

function replaceAll(str, search, replace) {
  return str.replace(new RegExp(escapeRegex(search), 'g'), replace)
}

export {getMatches, escapeRegex, replaceAll}
