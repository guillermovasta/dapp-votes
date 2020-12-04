import { ethers } from 'ethers'
import { walletPrivateKey, contractAddress } from '../constants'
import contractInterface from '../abi/ERC20.abi.json'

enum Networks {
  rinkeby = 4
}

export const createWeb3ContractInstance = (ethereum: any) => {
  const provider = new ethers.providers.Web3Provider(ethereum, Networks.rinkeby)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    contractAddress,
    contractInterface,
    signer
  )
  return contract
}

export const createDefaultContractInstance = () => {
  const provider = ethers.getDefaultProvider(Networks[Networks.rinkeby])
  const wallet = new ethers.Wallet(walletPrivateKey, provider)
  const contract = new ethers.Contract(
    contractAddress,
    contractInterface,
    wallet
  )
  return contract
}
