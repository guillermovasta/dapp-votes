import React, { useEffect } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    4, // Rinkeby
  ],
})

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export const Dashboard = () => {
  const { chainId, account, activate, active } = useWeb3React<Web3Provider>()

  useEffect(() => {
    activate(injectedConnector)
  }, [activate])

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      <p>active: {active ? 'true' : 'false'}</p>
    </div>
  )
}

const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Dashboard />
  </Web3ReactProvider>
)

export default App
