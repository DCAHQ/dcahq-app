import {
  boolCV,
  callReadOnlyFunction,
  cvToValue,
  principalCV,
  ReadOnlyFunctionOptions,
  uintCV
} from "@stacks/transactions"
import {
  contractDeployer,
  dcaManagerName,
  tokenMap,
  Tokens
} from "../../utils/helpers"
import { StacksMainnet } from "@stacks/network"

export async function getPrice(params: {
  network: StacksMainnet
  poolId: number
  token0: Tokens
  tokenIn: Tokens
  amtIn: string
  isSourceNumerator: boolean
}) {
  const { network, poolId, token0, isSourceNumerator, tokenIn, amtIn } = params
  console.log("Attempting to get velar price", {
    poolId,
    token0,
    tokenIn,
    amtIn,
    isSourceNumerator
  })
  const functionArgs = [uintCV(poolId), boolCV(true)]

  const options: ReadOnlyFunctionOptions = {
    contractAddress: contractDeployer,
    contractName: dcaManagerName,
    functionName: "get-price-b",
    functionArgs,
    network,
    senderAddress: contractDeployer
  }

  const response = await callReadOnlyFunction(options)
  console.log("velar get-price-b", {
    velarprice: response,
    token0,
    tokenIn,
    amtIn,
    isSourceNumerator,
    poolId,
    returned: cvToValue(response)
  })
  // prices are welsh/stx
  return Number(cvToValue(response)) / 10 ** tokenMap[tokenIn].decimal
}
