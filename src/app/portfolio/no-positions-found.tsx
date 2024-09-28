import { css } from "@/styled-system/css"
import { VStack } from "@/styled-system/jsx"
import React from "react"

const NoPositionsFound = () => {
  return (
    <VStack justifyContent="center">
      <span
        className={css({
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          display: "block"
        })}
      >
        It looks like you don&apos;t have any active DCA (Dollar Cost Averaging)
        positions yet. You are missing out on:
      </span>
      <ul>
        <li
          className={css({
            fontSize: "1.2rem",
            marginBottom: "0.5rem"
          })}
        >
          <span
            className={css({
              fontWeight: "bold"
            })}
          >
            - Low Fees:
          </span>
          You only cover transaction costs, keeping your expenses minimal.
        </li>
        <li
          className={css({
            fontSize: "1.2rem",
            marginBottom: "0.5rem"
          })}
        >
          <span
            className={css({
              fontWeight: "bold"
            })}
          >
            - Optimized Execution:
          </span>{" "}
          Breaks large swaps into smaller ones, helping you achieve better
          overall pricing.
        </li>
        <li
          className={css({
            fontSize: "1.2rem",
            marginBottom: "0.5rem"
          })}
        >
          <span
            className={css({
              fontWeight: "bold"
            })}
          >
            - Mitigate Market Risk:
          </span>{" "}
          Achieve a better average entry price, especially in volatile or
          down-trending markets.
        </li>
        <li
          className={css({
            fontSize: "1.2rem",
            marginBottom: "0.5rem"
          })}
        >
          <span
            className={css({
              fontWeight: "bold"
            })}
          >
            - Decentralized & Secure:
          </span>{" "}
          Powered by Bitcoin, non-custodial, and fully decentralized. Withdraw
          your assets anytime with full control.
        </li>
      </ul>
    </VStack>
  )
}

export default NoPositionsFound