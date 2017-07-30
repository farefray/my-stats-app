/* function editDistance (s1, s2) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  var costs = []
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else {
        if (j > 0) {
          var newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1
            }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }

    if (i > 0) {
      costs[s2.length] = lastValue
    }
  }
  return costs[s2.length]
} */

export function similarity (s1, s2) {
  let longer = s1
  let shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }

  let longerLength = longer.length
  let shorterLength = shorter.length
  if (longerLength === 0) {
    return 1.0
  }

  let bonus = 0
  if (longer === shorter) {
    bonus += 0.5
  }

  // hardcode participants for 1xbet
  if (longer.indexOf(' - ') > 0 && shorter.indexOf(' - ') > 0) {
    bonus += 1
  }

  // compare char by char with mask
  while (shorterLength--) {
    // isNaN(num)     // returns true if the variable does NOT contain a valid number
    let l = longer[shorterLength]
    let s = shorter[shorterLength]
    if (/[0-9]/.test(l) && /[0-9]/.test(s)) {
      bonus += 1.0 / parseFloat(longer.length)
      // eslint-disable-next-line no-useless-escape
    } else if (/[~`!#$%&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(l) && /[~`!#$%&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(s)) {
      bonus += (1.0 / parseFloat(longer.length)) * 2.0
    } else if (l === ' ' && l === s) {
      bonus += (1.0 / parseFloat(longer.length)) * 2.0
    }
  }

  /* let longerSplit = _.words(longer)
  let shorterSplit = _.words(shorter)
  if (longerSplit.length === shorterSplit.length) {
    bonus += longerSplit.length * 0.1
  } */

  let final = bonus /* + (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength) */
  // console.log(shorter + ' vs ' + longer + ' = ' + final)
  // console.log(shorter + ' vs ' + longer + ' = ' + (bonus + (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)))
  return final
}
