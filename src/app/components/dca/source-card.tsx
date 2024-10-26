"use client"

import React, { memo, useEffect, useState } from "react"
import { Flex, Box, VStack, HStack } from "@/styled-system/jsx"
import { UserData } from "@stacks/connect"
import { getBalance } from "@/src/app/common/functionCalls/getBalance"
import {
  contractMap,
  sourceTokens,
  targetTokens,
  tokenMap,
  Tokens
} from "@/src/app/common/utils/helpers"
import { prettyBalance, prettyPrice } from "../../common/utils/pretty"
import { StacksMainnet } from "@stacks/network"
import InputValue from "./input-value"
import TokenSelector from "../token-selector"
import { getPriceUsd } from "../../common/functionCalls/getPrice"
import {
  getAvailableSourceTokens,
  getAvailableTargetTokens
} from "../../common/utils/filter-tokens"

interface SourceComponentProps {
  sourceToken: Tokens
  setSourceToken: React.Dispatch<React.SetStateAction<Tokens>>
  setTargetToken: React.Dispatch<React.SetStateAction<Tokens>>
  setTargetTokens: React.Dispatch<React.SetStateAction<Tokens[]>>
  sourceValueUsd: number
  setSourceValueUsd: React.Dispatch<React.SetStateAction<number>>
  stxPrice: number
  totalAmount: string
  setTotalAmount: (amount: string) => void
  purchaseAmount: string
  setPurchaseAmount: (amount: string) => void
  user: UserData | null
  network: StacksMainnet | null
  errorState: string
  setErrorState: (e: string) => void
}

const SourceCard = ({
  user,
  sourceToken,
  setSourceToken,
  totalAmount,
  setTotalAmount,
  purchaseAmount,
  setPurchaseAmount,
  sourceValueUsd,
  setSourceValueUsd,
  network,
  setTargetTokens,
  setTargetToken,
  stxPrice,
  errorState,
  setErrorState
}: SourceComponentProps) => {
  const [balance, setBalance] = useState<BigInt>(BigInt(0))

  useEffect(() => {
    let active = true
    async function fetchBalance() {
      if (!user || !network) return
      const balance = await getBalance(
        sourceToken,
        user.profile.stxAddress.mainnet,
        network
      )
      if (!active) return
      setBalance(balance)

      // Compare balance with totalAmount and set error state
      const totalAmountAsBigInt = BigInt(
        Number(totalAmount) * 10 ** tokenMap[sourceToken].decimal
      )
      if (balance < totalAmountAsBigInt) {
        setErrorState("Insufficient balance")
      } else {
        setErrorState("")
      }

      console.log("source-card fetchBalance", {
        balance,
        sourceToken
      })
    }

    fetchBalance()
    const newTargetTokens = getAvailableTargetTokens(targetTokens, sourceToken)
    setTargetToken(newTargetTokens[0])
    setTargetTokens(newTargetTokens)

    return () => {
      active = false
    }
  }, [sourceToken.valueOf(), user, totalAmount])

  useEffect(() => {
    if (!totalAmount) return
    let active = true
    async function fetchPrice() {
      if (!network) return
      const priceUsd = await getPriceUsd(sourceToken, network, stxPrice)
      console.log("source-card fetchPrice", {
        stxPrice,
        totalAmount,
        priceUsd,
        sourceToken
      })
      if (!active) return
      setSourceValueUsd(Number(totalAmount) * priceUsd)
    }

    fetchPrice()
    return () => {
      active = false
    }
  }, [sourceToken.valueOf(), totalAmount, stxPrice])

  const setPurchaseAmountWrapper = (amount: string) => {
    const purchaseAmountAsBigInt = BigInt(
      Number(totalAmount) * 10 ** tokenMap[sourceToken].decimal
    )
    const minDcaThreshold = tokenMap[sourceToken].minDcaThreshold
    const isSourceAmountLow =
      minDcaThreshold &&
      purchaseAmountAsBigInt < minDcaThreshold &&
      totalAmount &&
      purchaseAmount
    if (isSourceAmountLow) {
      setErrorState("Purchase amount too low")
    } else {
      setErrorState("")
    }

    setPurchaseAmount(amount)
  }

  const sourceDetails = tokenMap[sourceToken]

  return (
    <Box
      display="block"
      bg="#0e0e13"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={errorState ? "red" : "grey"}
    >
      <VStack width="100%">
        <Flex
          flexDirection={["column", "column", "row"]}
          alignItems={["flex-start", "flex-start", "center"]}
          width="100%"
          gap={["0", "0", "1.5rem"]}
          justifyContent="space-between"
        >
          <Box m={["0.5rem", "1rem"]}>
            <TokenSelector
              options={getAvailableSourceTokens(sourceTokens)}
              selectedOption={sourceToken}
              onSelect={setSourceToken}
              imagePath={sourceDetails.image}
            />
          </Box>
          <InputValue
            value={purchaseAmount}
            setValue={setPurchaseAmountWrapper}
            name="Amount per Buy"
          />
          <InputValue
            value={totalAmount}
            setValue={setTotalAmount}
            name="Total Amount"
          />
        </Flex>
        <HStack width="100%">
          <Flex
            justifyContent="space-between"
            flexDirection={["column", "row"]}
            width="100%"
            color={"grey"}
            mx={["0.5rem", "1rem"]}
            fontFamily={"sans-serif"}
            fontSize={["small", "medium"]}
          >
            <span>
              Balance: {prettyBalance(balance, sourceDetails.decimal)}
            </span>
            <span>≈ ${prettyPrice(sourceValueUsd)}</span>
          </Flex>
        </HStack>
      </VStack>
    </Box>
  )
}

export default memo(SourceCard)
