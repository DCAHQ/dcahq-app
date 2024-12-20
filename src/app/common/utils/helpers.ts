import dotenv from "dotenv"
dotenv.config()

import {
  createApiKeyMiddleware,
  createFetchFn,
  StacksMainnet
} from "@stacks/network"

const apiMiddleware = createApiKeyMiddleware({
  apiKey: process.env.API_KEY ?? ""
})

// Create a custom fetch function using your API key
const customFetchFn = createFetchFn(apiMiddleware)
export const newStacksMainnet = new StacksMainnet({ fetchFn: customFetchFn })

export const maxUint128 = BigInt("340282366920938463463374607431768211455")
export const maxJavascriptNumber = 9007199254740991
export const defaultFactor = 100_000_000

export const appName = "DCA HQ"
const version = "-v0-0"
export const contractDeployer = "SP1HH99SPQJVWVTVD6E6V8XF5BDH30B4PGZ4SEXD"
export const burnAddress = "SP000000000000000000002Q6VF78"
export const authName = "auth" + version
export const dcaManagerName = "dca-manager" + "-v0-2"
export const dcaVaultName = "dca-vault" + version
export const defaultStrategyName = "default-strategy" + version
export const strategyName = "strategy" + version

export const dcaManagerContract = contractDeployer + "." + dcaManagerName

export const defaultStrategyContract =
  contractDeployer + "." + defaultStrategyName

export const dcaUsersAlexFunction = "dca-users-a"

export type UserKey = {
  interval: number
  strategy: string
  source: string
  target: string
}

export type DcaDataKey = {
  user: string
  interval: number
  strategy: string
  source: string
  target: string
}

export type DcaData = {
  isPaused: boolean
  amount: string
  sourceAmountLeft: string
  targetAmount: string
  minPrice: string
  maxPrice: string
  lastUpdatedTimestamp: string
}

export const ONE_6 = 10 ** 6
export const ONE_8 = 10 ** 8

export const alex = "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM"

// cant add seconds values to the enums since i want to follow the contract as close as possible, will need its own map
export enum Intervals {
  hours2,
  hours6,
  hours12,
  daily,
  weekly
}

export function estimateDuration(
  interval: Intervals,
  frequency: number
): string {
  if (frequency == Infinity) return "--"
  const intervalHoursMap: Record<Intervals, number> = {
    [Intervals.hours2]: 2,
    [Intervals.hours6]: 6,
    [Intervals.hours12]: 12,
    [Intervals.daily]: 24,
    [Intervals.weekly]: 168
  }
  const hoursPerInterval = intervalHoursMap[interval]
  const totalHours = hoursPerInterval * frequency
  if (totalHours < 168) {
    const days = Math.ceil(totalHours / 24)
    return `in ${days} day${days > 1 ? "s" : ""}`
  } else {
    const weeks = Math.ceil(totalHours / 168)
    return `in ${weeks} week${weeks > 1 ? "s" : ""}`
  }
}

export const intervalSeconds = {
  [Intervals.hours2]: 2 * 60 * 60,
  [Intervals.hours6]: 6 * 60 * 60,
  [Intervals.hours12]: 12 * 60 * 60,
  [Intervals.daily]: 24 * 60 * 60,
  [Intervals.weekly]: 7 * 24 * 60 * 60
}

export enum AMM {
  Alex,
  Velar
}

export enum Tokens {
  STX = 1,
  // Alex
  ASTX = 2,
  AUSDT = 3,
  AWWELSH = 4,
  // Velar
  VSTX = 5,
  VAEUSDC = 6,
  VWELSH = 7
}

export const sourceTokens = [
  Tokens.STX,
  // alex
  // Tokens.ASTX,
  // Tokens.AUSDT,
  // velar
  Tokens.VSTX,
  Tokens.VAEUSDC
]

export const targetTokens = [
  // Tokens.STX,
  // alex
  // Tokens.ASTX,
  // Tokens.AWWELSH,
  // velar
  Tokens.VSTX,
  Tokens.VWELSH
]

export const alexWStxContract =
  "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wstx-v2"
export const alexUsdtContract =
  "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt"
export const alexWelshContract =
  "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wcorgi"

//velar
export const velarCore = "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core"
export const velarLibrary =
  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-library"
export const shareFeeToContract =
  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to"

export const velarAeusdcContract =
  "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc"
export const velarAeusdcDecimal = 6
export const velarWstxContract =
  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"
export const velarWstxDecimal = 6
export const welshContract =
  "SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token"
export const velarWelshDecimal = 6

export const stxWrappers = [Tokens.ASTX, Tokens.VSTX]
export const stxPlaceholderContract = "placeholder.stx" as Contract

export type Contract = `${string}.${string}`
export type ValuePieChartData = {
  token: string
  value: number
  amount: string | number
}

export const contractMap: { [key: Contract]: Tokens } = {
  [stxPlaceholderContract]: Tokens.STX,
  [alexWStxContract]: Tokens.ASTX,
  [alexUsdtContract]: Tokens.AUSDT,
  [alexWelshContract]: Tokens.AWWELSH,
  [velarWstxContract]: Tokens.VSTX,
  [velarAeusdcContract]: Tokens.VAEUSDC,
  [welshContract]: Tokens.VWELSH
}

export const tokenMap: {
  [key in Tokens]: {
    contract: Contract //
    decimal: number
    assetName: string
    image: string
    displayName: string
    minDcaThreshold?: number
  }
} = {
  [Tokens.STX]: {
    contract: stxPlaceholderContract,
    image: "/stx.svg",
    decimal: 6,
    assetName: "stx",
    displayName: "STX",
    minDcaThreshold: 2 * 10 ** 6
  },
  //  ALEX
  [Tokens.ASTX]: {
    contract: alexWStxContract,
    image: "/stx.svg",
    decimal: 8,
    assetName: "wstx",
    displayName: "STX",
    minDcaThreshold: 2 * 10 ** 8
  },
  [Tokens.AUSDT]: {
    contract: alexUsdtContract,
    decimal: 8,
    image: "/susdt.svg",
    assetName: "bridged-usdt",
    displayName: "USDT",
    minDcaThreshold: 5 * 10 ** 8
  },
  [Tokens.AWWELSH]: {
    contract: alexWelshContract,
    image: "/welsh_tokenlogo.png",
    decimal: 8,
    assetName: "wcorgi",
    displayName: "WELSH"
  },
  // VELAR
  [Tokens.VSTX]: {
    contract: velarWstxContract,
    image: "/stx.svg",
    decimal: velarWstxDecimal,
    assetName: "wstx",
    displayName: "STX",
    minDcaThreshold: 2 * 10 ** 6
  },
  [Tokens.VAEUSDC]: {
    contract: velarAeusdcContract,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/18852.png",
    decimal: velarWelshDecimal,
    assetName: "aeUSDC",
    displayName: "aeUSDC",
    minDcaThreshold: 5 * 10 ** 6
  },
  [Tokens.VWELSH]: {
    contract: welshContract,
    image: "/welsh_tokenlogo.png",
    decimal: velarWstxDecimal,
    assetName: "welsh",
    displayName: "WELSH"
  }
}

export const stableCoins = [Tokens.AUSDT, Tokens.VAEUSDC]

type AlexPairCombinations = {
  [key in Tokens]?: {
    [key in Tokens]?: { factor: number; isSourceNumerator: boolean }
  }
}

type VelarPairCombinations = {
  [key in Tokens]?: {
    [key in Tokens]?: {
      poolId: number
      token0: Tokens
      isSourceNumerator: boolean
      isSourceToken0: boolean
    }
  }
}

export const alexPairConfig: AlexPairCombinations = {
  [Tokens.ASTX]: {
    [Tokens.AUSDT]: { factor: defaultFactor, isSourceNumerator: false },
    [Tokens.AWWELSH]: { factor: defaultFactor, isSourceNumerator: true }
  },
  [Tokens.AUSDT]: {
    [Tokens.ASTX]: { factor: defaultFactor, isSourceNumerator: false },
    [Tokens.AWWELSH]: { factor: defaultFactor, isSourceNumerator: false }
  }
}

export const getIsSourceNumerator = (source: Tokens, target: Tokens) => {
  if (alexPairConfig[source]?.[target]?.isSourceNumerator !== undefined) {
    return alexPairConfig[source][target].isSourceNumerator
  } else if (
    velarPairConfig[source]?.[target]?.isSourceNumerator !== undefined
  ) {
    return velarPairConfig[source][target].isSourceNumerator
  } else {
    return false // Default to false if not found in either config
  }
}
export const velarPairConfig: VelarPairCombinations = {
  [Tokens.VSTX]: {
    [Tokens.VAEUSDC]: {
      poolId: 6,
      token0: Tokens.VSTX,
      isSourceNumerator: false,
      isSourceToken0: true
    },
    [Tokens.VWELSH]: {
      poolId: 27,
      token0: Tokens.VSTX,
      isSourceNumerator: true,
      isSourceToken0: true
    }
  },
  [Tokens.VAEUSDC]: {
    [Tokens.VSTX]: {
      poolId: 6,
      token0: Tokens.VSTX,
      isSourceNumerator: false,
      isSourceToken0: false
    },
    [Tokens.VWELSH]: {
      poolId: 10,
      token0: Tokens.VWELSH,
      isSourceNumerator: false,
      isSourceToken0: false
    } // disabled in tokens filtering
  },
  [Tokens.VWELSH]: {
    // [Tokens.VAEUSDC]: { poolId: 10, token0: Tokens.VWELSH }
    [Tokens.VSTX]: {
      poolId: 27,
      token0: Tokens.VSTX,
      isSourceNumerator: false,
      isSourceToken0: false
    }
  }
}

export const isEmptyOrNumberInput = (value: string) =>
  value === "" || /^\d*\.?\d*$/.test(value)

export const colors = [
  "#634bde",
  "#0033ad",
  "#00ffbd",
  "#F7931A",
  "rgb(250,0,0)",
  "LightSalmon",
  "rgb(100,250,250)",
  "rgb(0,250,0)",
  "rgb(250,250,100)",
  "rgb(250,250,250)",
  "rgb(250,100,100)",
  "rgb(100,250,250)",
  "MediumSpringGreen",
  "blueviolet",
  "brown",
  "burlywood",
  "burlywood",
  "chartreuse",
  "cornflowerblue",
  "crimson",
  "cyan",
  "darkolivegreen"
]
