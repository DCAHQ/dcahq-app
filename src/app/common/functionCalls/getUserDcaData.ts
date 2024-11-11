import { StacksMainnet } from "@stacks/network"
import {
  callReadOnlyFunction,
  cvToValue,
  principalCV,
  ReadOnlyFunctionOptions
} from "@stacks/transactions"
import {
  contractDeployer,
  contractMap,
  DcaData,
  DcaDataKey,
  dcaManagerName,
  defaultStrategyContract,
  sourceTokens,
  targetTokens,
  tokenMap,
  Tokens,
  UserKey
} from "../utils/helpers"
import { intervalOptions } from "../../components/dca/interval-button"
import { getDcaData } from "./getDcaData"

export async function getUserDcaData(
  user: string,
  network: StacksMainnet
): Promise<{ key: UserKey; dcaData: DcaData | undefined }[]> {
  if (!user) return []

  const dcaDataPromises: Promise<DcaData | undefined>[] = []
  const keys: UserKey[] = []
  intervalOptions.forEach(interval => {
    sourceTokens
      .filter(t => t != Tokens.STX)
      .forEach(source => {
        targetTokens
          .filter(t => t != Tokens.STX)
          .forEach(target => {
            const sourceContract = tokenMap[source].contract
            const targetContract = tokenMap[target].contract
            const dataPromise = getDcaData(
              user,
              sourceContract,
              targetContract,
              interval,
              defaultStrategyContract,
              network
            )
            dcaDataPromises.push(dataPromise)
            keys.push({
              source: sourceContract,
              target: targetContract,
              strategy: defaultStrategyContract,
              interval
            })
          })
      })
  })

  const dcaDatas = await Promise.all(dcaDataPromises)
  return keys.map((k, i) => {
    return { key: k, dcaData: dcaDatas[i] }
  })
}
