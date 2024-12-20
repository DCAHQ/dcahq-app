import { StacksMainnet } from "@stacks/network"
import { getPrice as getPriceAlex } from "./alex/getPrice"
import { getPrice as getPriceVelar } from "./velar/getPrice"
import { isSourceANumerator } from "../utils/isSourceANumerator"
import { isStxOrStxWrapper } from "../utils/filter-tokens"
import {
  alexPairConfig,
  AMM,
  ONE_6,
  stableCoins,
  tokenMap,
  Tokens,
  velarPairConfig
} from "../utils/helpers"
import { chooseAmm } from "../utils/chooseAmm"

type PriceParams = {
  sourceToken: Tokens
  network: StacksMainnet
  tokenX?: Tokens
  tokenY?: Tokens
  decimal?: number
  factor?: number
  poolId?: number
  token0?: Tokens
  tokenIn?: Tokens
  amtIn?: string
  isSourceNumerator?: boolean
}

export function getPrice(params: PriceParams) {
  const { sourceToken, tokenX, tokenY, token0 } = params
  const amm = chooseAmm(sourceToken)
  // if (tokenX && tokenY && tokenX === tokenY) return 1
  if (isStxOrStxWrapper(sourceToken)) return 1
  // alex
  // if (
  //   tokenX &&
  //   tokenY &&
  //   stableCoins.includes(tokenX) &&
  //   stableCoins.includes(tokenY)
  // )
  //   return 1

  // velar
  // if (stableCoins.includes(sourceToken) && amm == AMM.Velar) return 1

  switch (amm) {
    case AMM.Alex:
      return getPriceFromAlex(params)
    case AMM.Velar:
      return getPriceFromVelar(params)
    default:
      throw new Error("Unhandled AMM: " + amm)
  }
}

function getPriceFromAlex(params: PriceParams) {
  const { network, tokenX, tokenY, decimal, factor } = params

  if (!network || !tokenX || !tokenY) {
    throw new Error(
      `Incorrect Alex getPrice params: tokenX ${tokenX}, tokenY ${tokenY}`
    )
  }

  return getPriceAlex({ network, tokenX, tokenY, decimal, factor })
}

function getPriceFromVelar(params: PriceParams) {
  const {
    network,
    poolId,
    token0,
    tokenIn,
    amtIn,
    isSourceNumerator,
    sourceToken
  } = params
  if (!network || !poolId || !token0 || !tokenIn || !amtIn) {
    throw new Error(
      `Incorrect Velar getPrice params: token ${sourceToken}, poolId ${poolId}, token0 ${token0}, tokenIn ${tokenIn}, amtIn ${amtIn}`
    )
  }

  return getPriceVelar({
    network,
    poolId,
    token0,
    tokenIn,
    amtIn,
    isSourceNumerator: isSourceNumerator ?? false
  })
}

export function getPriceParams(
  token: Tokens,
  network: StacksMainnet
): PriceParams {
  const amm = chooseAmm(token)

  switch (amm) {
    case AMM.Alex:
      const alexParams = getAlexPriceParams(network, token)
      return alexParams
    case AMM.Velar:
      const params = getVelarPriceParams(network, token)
      return params
    default:
      throw new Error("Unhandled AMM: " + amm)
  }
}

function getAlexPriceParams(
  network: StacksMainnet,
  token: Tokens
): PriceParams {
  if (isStxOrStxWrapper(token)) token = Tokens.ASTX

  const tokenX = Tokens.ASTX
  const tokenY = token
  const decimal = tokenMap[token].decimal
  const factor = alexPairConfig[token]?.[Tokens.ASTX]?.factor

  return {
    sourceToken: token,
    network,
    tokenX,
    tokenY,
    decimal,
    factor
  }
}

function getVelarPriceParams(
  network: StacksMainnet,
  token: Tokens
): PriceParams {
  if (isStxOrStxWrapper(token)) token = Tokens.VSTX

  const poolId = velarPairConfig[token]?.[Tokens.VSTX]?.poolId
  const token0 = velarPairConfig[token]?.[Tokens.VSTX]?.token0
  const tokenIn = Tokens.VSTX
  const amtIn = ONE_6.toString()
  const target = Tokens.AUSDT
  const isSourceNumerator = isSourceANumerator(token, target)
  return {
    sourceToken: token,
    network,
    poolId,
    token0,
    tokenIn,
    amtIn,
    isSourceNumerator
  }
}

export async function getPriceUsd(
  token: Tokens,
  network: StacksMainnet,
  stxPrice: number
) {
  if (stableCoins.includes(token)) return 1
  if (isStxOrStxWrapper(token)) return stxPrice
  const priceParams = getPriceParams(token, network)
  const tokenPriceInStx = await getPrice(priceParams)
  const tokenPriceInUsd = tokenPriceInStx / stxPrice
  console.log("getPriceUsd", {
    tokenPriceInUsd,
    tokenPriceInStx,
    stxPrice,
    token,
    priceParams
  })
  return tokenPriceInUsd
}
