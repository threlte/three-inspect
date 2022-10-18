/* eslint-disable no-underscore-dangle */
/*
 * Calculate, how many string `a`
 * requires edits, to become string `b`
 */
export const searchStringEditDistance = (a: string, b: string) => {
  /*
   * Levenshtein distance
   * https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
   */
  if (a.length === 0) {
    return b.length
  }

  if (b.length === 0) {
    return a.length
  }

  if (a === b) {
    return 0
  }

  let i = 0
  let j = 0
  let il = 0
  let jl = 0
  const matrix = []

  for (i = 0, il = b.length; i <= il; i += 1) {
    matrix[i] = [i]
  }

  for (i = 0, il = a.length; i <= il; i += 1) {
    matrix[0][i] = i
  }

  for (i = 1, il = b.length; i <= il; i += 1) {
    for (j = 1, jl = a.length; j <= jl; j += 1) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        )
      }
    }
  }

  return matrix[b.length][a.length]
}


/*
 * Calculate, how many characters string `b`
 * contains of a string `a`
 */
export const searchCharsContains = (a: string, b: string) => {
  if (a === b) {
    return a.length
  }

  let contains = 0
  const ind: Record<string, boolean> = { }
  let i

  for (i = 0; i < b.length; i += 1) {
    ind[b.charAt(i)] = true
  }

  for (i = 0; i < a.length; i += 1) {
    if (ind[a.charAt(i)]) {
      contains += 1
    }
  }

  return contains
}


// Tokenize string into array of tokens
export const searchStringTokenize = (name: string) => {
  const tokens = []

  /*
   * CamelCase
   * upperCASE123
   */
  const string = name
    .replace(/([^A-Z])([A-Z][^A-Z])/g, '$1 $2')
    .replace(/([A-Z0-9]{2,})/g, ' $1')

  /*
   * Space notation
   * dash-notation
   * underscore_notation
   */
  const parts = string.split(/(\s|\-|_)/g)

  // Filter valid tokens
  for (let i = 0; i < parts.length; i += 1) {
    parts[i] = parts[i].toLowerCase().trim()
    if (parts[i] && parts[i] !== '-' && parts[i] !== '_') {
      tokens.push(parts[i])
    }
  }

  return tokens
}


const _searchItems = (items, search, args) => {
  const results = []

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]

    // Direct hit
    if (item.subFull !== Infinity) {
      results.push(item)

      if (item.edits === Infinity) {
        item.edits = 0
      }

      if (item.sub === Infinity) {
        item.sub = item.subFull
      }

      continue
    } else if (item.name === search || item.name.indexOf(search) === 0) {
      results.push(item)

      if (item.edits === Infinity) {
        item.edits = 0
      }

      if (item.sub === Infinity) {
        item.sub = 0
      }

      continue
    }

    // Check if name contains enough of search characters
    const contains = searchCharsContains(search, item.name)
    if (contains / search.length < args.containsCharsTolerance) {
      continue
    }

    let editsCandidate = Infinity
    let subCandidate = Infinity

    // For each token
    for (let t = 0; t < item.tokens.length; t += 1) {
      // Direct token match
      if (item.tokens[t] === search) {
        editsCandidate = 0
        subCandidate = t
        break
      }

      const edits = searchStringEditDistance(search, item.tokens[t])

      if ((subCandidate === Infinity || edits < editsCandidate) && item.tokens[t].indexOf(search) !== -1) {
        // Search is a substring of a token
        subCandidate = t
        editsCandidate = edits
        continue
      } else if (subCandidate === Infinity && edits < editsCandidate) {
        // New edits candidate, not a substring of a token
        if ((edits / Math.max(search.length, item.tokens[t].length)) <= args.editsDistanceTolerance) {
          // Check if edits tolerance is satisfied
          editsCandidate = edits
        }
      }
    }

    // No match candidate
    if (editsCandidate === Infinity) {
      continue
    }

    // Add new result
    results.push(item)
    item.edits = item.edits === Infinity ? editsCandidate : item.edits + editsCandidate
    item.sub = item.sub === Infinity ? subCandidate : item.sub + subCandidate
  }

  return results
}

/*
 * Perform search through items
 * items is an array with arrays of two values
 * where first value is a string to be searched by
 * and second value is an object to be found
 *
 * [
 *     [ 'camera', {object} ],
 *     [ 'New Entity', {object} ],
 *     [ 'Sun', {object} ]
 * ]
 *
 */
export const searchItems = (items: string[][], s: string, args: {
  containsCharsTolerance?: number
  editsDistanceTolerance?: number
  limitResults?: number
} = {}) => {
  let i = 0

  const normalized = (s || '').toLowerCase().trim()

  if (!normalized) {
    return []
  }

  const searchTokens = searchStringTokenize(normalized)
  if (!searchTokens.length) {
    return []
  }

  args.containsCharsTolerance ??= 0.5
  args.editsDistanceTolerance ??= 0.5

  let records = []

  for (i = 0; i < items.length; i += 1) {
    const subInd = items[i][0]
      .toLowerCase()
      .trim()
      .indexOf(normalized)

    records.push({
      edits: Infinity,
      item: items[i][1],
      name: items[i][0],
      sub: Infinity,
      subFull: (subInd === -1) ? Infinity : subInd,
      tokens: searchStringTokenize(items[i][0]),
    })
  }

  // Search each token
  for (i = 0; i < searchTokens.length; i += 1) {
    records = _searchItems(records, searchTokens[i], args)
  }

  // Sort result first by substring? then by edits number
  records.sort((a, b) => {
    if (a.subFull !== b.subFull) {
      return a.subFull - b.subFull
    } else if (a.sub !== b.sub) {
      return a.sub - b.sub
    } else if (a.edits !== b.edits) {
      return a.edits - b.edits
    }
    return a.name.length - b.name.length
  })

  // Return only items without match information
  for (i = 0; i < records.length; i += 1) {
    records[i] = records[i].item
  }

  // Limit number of results
  if (args.limitResults !== undefined && records.length > args.limitResults) {
    records = records.slice(0, args.limitResults)
  }

  return records
}
