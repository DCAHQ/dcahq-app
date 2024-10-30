import {
  alexPairConfig,
  stxWrappers,
  tokenMap,
  Tokens,
  velarPairConfig
} from "./helpers"

export const isAlexToken = (token: Tokens) =>
  token === Tokens.ASTX || alexPairConfig[Tokens.ASTX]?.[token]

export const isVelarToken = (token: Tokens) =>
  token === Tokens.VSTX || velarPairConfig[Tokens.VSTX]?.[token]

// Needs to filter duplicates such as wrappers
export function getDisplayedSourceTokens(allTokens: Tokens[], source: Tokens) {
  return allTokens.filter(t => {
    if (isStxOrStxWrapper(source)) return !isStxOrStxWrapper(t)
    return !isWrapper(t)
  })
}

export function getDisplayedTargetTokens(allTokens: Tokens[], source: Tokens) {
  if (isStxOrStxWrapper(source))
    // return allTokens.filter(t => t != source && t == Tokens.AWWELSH)
    return allTokens.filter(t => t != source && t == Tokens.VWELSH)

  return allTokens.filter(t => {
    if (t != source)
      if (isAlexToken(source)) {
        return isAlexToken(t)
      } else if (isVelarToken(source)) {
        if (t == Tokens.VWELSH) return false
        return isVelarToken(t)
      }
    return false
  })
}

const isWrapper = (token: Tokens) => {
  return (
    tokenMap[token].assetName == "wstx" || tokenMap[token].assetName == "wcorgi"
  )
}

export const isStxOrStxWrapper = (token: Tokens) =>
  token && (token == Tokens.STX || stxWrappers.includes(token))

export const getStxWrapperFromTarget = (target: Tokens) => {
  if (isAlexToken(target)) return Tokens.ASTX
  if (isVelarToken(target)) return Tokens.VSTX
  return Tokens.STX
}
