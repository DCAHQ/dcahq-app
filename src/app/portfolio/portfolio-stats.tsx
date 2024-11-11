"use client"

import { HStack, VStack } from "@/styled-system/jsx"
import React, { useEffect, useState } from "react"
import { useUser } from "../contexts/UserProvider"
import {
  createApiKeyMiddleware,
  createFetchFn,
  StacksMainnet
} from "@stacks/network"
import { getUserKeys } from "../common/functionCalls/getUserKeys"
import {
  DcaData,
  newStacksMainnet,
  UserKey,
  ValuePieChartData
} from "../common/utils/helpers"
import NoPositionsFound from "./no-positions-found"
import PositionStats from "./position-stats"
import PieChart from "../components/charts/pie-chart"
import { groupAndSumByToken } from "../common/groupBy"
import PositionStatsContainer from "./position-stats-container"
import { getUserDcaData } from "../common/functionCalls/getUserDcaData"

const PortfolioStats = () => {
  const { userSession } = useUser()
  const [user, setUser] = useState<string>("")
  const [userDcaData, setUserDcaData] = useState<
    { key: UserKey; dcaData: DcaData | undefined }[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sourcesValues, setSourcesValues] = useState<ValuePieChartData[]>([])
  const [targetsValues, setTargetsValues] = useState<ValuePieChartData[]>([])
  const [network] = useState<StacksMainnet>(newStacksMainnet)

  useEffect(() => {
    const fetchData = async () => {
      if (!userSession?.isUserSignedIn()) {
        setIsLoading(false)
        return
      }
      const userData = userSession.loadUserData()
      setUser(userData.profile.stxAddress.mainnet)

      try {
        const userDcaData = await getUserDcaData(
          userData.profile.stxAddress.mainnet,
          network
        )
        setUserDcaData(userDcaData.filter(d => d.dcaData))
      } catch (error) {
        console.error("Failed to fetch user keys:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userSession, network])

  console.log({
    user,
    network,
    userDcaData,
    sourcesValues,
    targetsValues
  })
  if (isLoading) return <div>Loading...</div> // todo use a loading spinner
  if (!user || !userDcaData?.length) return <NoPositionsFound />
  return (
    <VStack>
      {!!user && !!network && !!userDcaData.length && (
        <HStack>
          <PieChart data={groupAndSumByToken(sourcesValues)} name="Source" />
          <PieChart data={groupAndSumByToken(targetsValues)} name="Target" />
        </HStack>
      )}
      <VStack>
        {userDcaData.map((userDcaData, index) => {
          if (!userDcaData.dcaData) return
          return (
            <PositionStatsContainer
              key={index}
              dcaData={userDcaData.dcaData}
              userKey={userDcaData.key}
              address={user}
              network={network}
              setSourcesValues={setSourcesValues}
              setTargetsValues={setTargetsValues}
            />
          )
        })}
      </VStack>
    </VStack>
  )
}

export default PortfolioStats
