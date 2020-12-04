import React from 'react'
import {
  createDefaultContractInstance,
  createWeb3ContractInstance
} from './utils'

const App = () => {
  const ethereum = (window as any).ethereum
  const web3Contract = createWeb3ContractInstance(ethereum)
  const defaultContract = createDefaultContractInstance()

  const handleConnectToMetaMask = () => {
    ethereum.request({ method: 'eth_requestAccounts' })
  }

  return (
    <>
      <button onClick={handleConnectToMetaMask}>Connect to MetaMask</button>
    </>
  )
}

export default App
