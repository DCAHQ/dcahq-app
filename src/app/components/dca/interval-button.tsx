import React, { memo, useState } from "react"
import { css } from "@/styled-system/css"
import { HStack } from "@/styled-system/jsx"
import { Intervals } from "../../common/utils/helpers"

export const intervalOptions: Intervals[] = [
  // Intervals.hours2,
  // Intervals.hours6,
  Intervals.hours12,
  Intervals.daily,
  Intervals.weekly
]

const IntervalButton = ({
  label,
  selectedInterval,
  setSelectedInterval
}: {
  label?: string
  selectedInterval: Intervals
  setSelectedInterval: React.Dispatch<React.SetStateAction<Intervals>>
}) => {
  const intervalDetails: { [key: string]: string } = {
    hours2: "automatic buy every 2 hours",
    hours6: "automatic buy every 6 hours",
    hours12: "automatic buy every 12 hours",
    daily: "automatic buy every day",
    weekly: "automatic buy every week"
  }
  const displayDetails: { [key: string]: string } = {
    hours2: "2 hours",
    hours6: "6 hours",
    hours12: "12 hours",
    daily: "Day",
    weekly: "Week"
  }

  return (
    <div>
      {!!label && (
        <span
          className={css({
            fontSize: "1.1rem",
            mr: "0.5rem"
          })}
        >
          {label}
        </span>
      )}
      <div
        className={css({
          px: "5px",
          borderRadius: "20px",
          minHeight: "42px",
          display: "inline-flex",
          bg: "#202329"
        })}
      >
        <HStack>
          {intervalOptions.map((interval, index) => (
            <React.Fragment key={interval}>
              <button
                className={css({
                  background:
                    selectedInterval === interval ? "#FFA500" : "transparent",
                  color: "white",
                  border: "2px solid transparent",
                  p: "0.25rem",
                  borderColor:
                    selectedInterval === interval ? "#CC8400" : "transparent",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  minWidth: "45px",
                  maxHeight: "35px"
                })}
                onClick={() => setSelectedInterval(interval)}
                title={intervalDetails[Intervals[interval]]}
              >
                {displayDetails[Intervals[interval]]}
              </button>
            </React.Fragment>
          ))}
        </HStack>
      </div>
    </div>
  )
}

export default memo(IntervalButton)
