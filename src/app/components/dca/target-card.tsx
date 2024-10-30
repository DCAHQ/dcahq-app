import React, { memo, useEffect, useState } from "react"
import { Box, Flex, VStack } from "@/styled-system/jsx"
import { tokenMap, Tokens } from "@/src/app/common/utils/helpers"
import { getPrice, getPriceUsd } from "../../common/functionCalls/getPrice"
import { prettyBalance } from "../../common/utils/pretty"
import { StacksMainnet } from "@stacks/network"
import TokenSelector from "../token-selector"
import InputValue from "./input-value"
import {
  getStxWrapperFromTarget,
  isStxOrStxWrapper
} from "../../common/utils/filter-tokens"

interface TargetComponentProps {
  targetToken: Tokens
  targetTokens: Tokens[]
  stxPrice: number
  targetPrice: number
  setTargetPrice: (price: number) => void
  sourceValueUsd: number
  network: StacksMainnet
  setTargetToken: (token: Tokens) => void
  setSourceToken: React.Dispatch<React.SetStateAction<Tokens>>
  estimatedDuration?: string
}

const TargetCard: React.FC<TargetComponentProps> = ({
  targetToken,
  targetTokens,
  sourceValueUsd,
  setTargetToken,
  network,
  targetPrice,
  setTargetPrice,
  stxPrice,
  setSourceToken,
  estimatedDuration = "--"
}) => {
  const [targetAmount, setTargetAmount] = useState(0)

  useEffect(() => {
    let active = true
    if (!stxPrice) return
    const setAmount = async () => {
      const priceUsd = await getPriceUsd(targetToken, network, stxPrice)
      console.log("target-card getPriceUsd", {
        priceUsd,
        targetToken,
        stxPrice
      })
      if (!active) return
      setTargetPrice(priceUsd)
    }
    setAmount()
    return () => {
      active = false
    }
  }, [targetToken, stxPrice])

  useEffect(() => {
    const amount = sourceValueUsd / targetPrice
    console.log("target-card setAmount", {
      sourceValueUsd,
      targetPriceUsd: targetPrice,
      targetToken,
      targetAmount: amount
    })
    setTargetAmount(amount)
  }, [network, targetToken, sourceValueUsd, targetPrice])

  useEffect(() => {
    setSourceToken((prevSource: Tokens) =>
      isStxOrStxWrapper(prevSource)
        ? getStxWrapperFromTarget(targetToken)
        : prevSource
    )
  }, [targetToken])

  return (
    <Box
      display="block"
      bg="#111319"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={"grey"}
    >
      <VStack width="100%">
        <Flex
          flexDirection={["column", "column", "row"]}
          alignItems={["flex-start", "flex-start", "center"]}
          width="100%"
          gap={["0", "0", "1.5rem"]}
          justifyContent="space-between"
        >
          <Box m={"1rem"}>
            <TokenSelector
              options={targetTokens}
              selectedOption={targetToken}
              onSelect={setTargetToken}
              imagePath={tokenMap[targetToken]?.image ?? ""}
            />
          </Box>
          <InputValue value={estimatedDuration} name="Estimated Duration" />
          <InputValue
            value={prettyBalance(targetAmount, 0)}
            name="Total Amount"
          />
        </Flex>
      </VStack>
    </Box>
  )
}

export default memo(TargetCard)
