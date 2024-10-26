import React, { useEffect, useState } from "react"
import { isEmptyOrNumberInput } from "../../common/utils/helpers"
import { css } from "@/styled-system/css"
import { VStack } from "@/styled-system/jsx"

const InputValue = ({
  value,
  setValue,
  name,
  center
}: {
  value: string
  setValue?: (value: string) => void
  name: string
  center?: boolean
}) => {
  const isReadOnly = !setValue
  const [query, setQuery] = useState(value)

  useEffect(() => {
    if (isReadOnly) {
      setQuery(value) // Sync the query with value when in read-only mode
    }
  }, [value, isReadOnly])

  useEffect(() => {
    if (!isReadOnly) {
      const timeOutId = setTimeout(() => {
        if (setValue) setValue(query)
      }, 500)
      return () => clearTimeout(timeOutId)
    }
  }, [query, isReadOnly])

  return (
    <VStack
      gap={0}
      className={css({
        width: "100%"
      })}
    >
      <label
        htmlFor="total-value"
        className={css({
          color: value ? "white" : "lightcyan",
          alignSelf: center ? "center" : ["center", "center", "flex-end"],
          fontWeight: "light",
          fontSize: "xl",
          marginRight: "0.25rem"
        })}
      >
        {name}
      </label>
      <input
        value={query}
        onChange={e => {
          const inputValue = e.target.value
          if (!isReadOnly && isEmptyOrNumberInput(inputValue)) {
            setQuery(inputValue)
          }
        }}
        placeholder={"0"}
        name="total-value"
        type="text"
        inputMode="decimal"
        className={css({
          marginRight: "0.5rem",
          width: "100%",
          color: value ? "white" : "lightcyan",
          fontWeight: "light",
          fontSize: "xl",
          textAlign: center ? "center" : ["center", "center", "right"],
          bg: "transparent",
          border: "none",
          outline: "none",
          borderBottom: { base: "1px solid gray", _readOnly: "none" }
        })}
        readOnly={isReadOnly}
      />
    </VStack>
  )
}

export default InputValue
