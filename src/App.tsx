import React, { useEffect, useState } from 'react'
import { Contract, BigNumber } from 'ethers'
import styled from 'styled-components'
import {
  Container,
  Grid,
  Paper,
  ThemeProvider,
  CssBaseline
} from '@material-ui/core'
import {
  createDefaultContractInstance,
  createWeb3ContractInstance
} from './utils'
import { theme } from './styles/theme'

interface Votes {
  yes: number
  no: number
}

enum ProviderNames {
  Web3Provider = 'Web3Provider',
  FallbackProvider = 'FallbackProvider'
}

const App = () => {
  const ethereum = (window as any).ethereum
  const web3Contract = createWeb3ContractInstance(ethereum)
  const defaultContract = createDefaultContractInstance()

  const [votes, setVotes] = useState<Votes>()
  const [contract, setContract] = useState<Contract>(defaultContract)

  const providerName = contract.provider.constructor.name
  console.log(providerName)

  useEffect(() => {
    try {
      const getVotes = async () => {
        console.log('getting votes')
        const votesForYes = await contract.votesForYes()
        const votesForNo = await contract.votesForNo()
        setVotes({
          yes: parseInt(votesForYes),
          no: parseInt(votesForNo)
        })
      }
      getVotes()
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleConnectToMetaMask = () => {
    console.log('connecting to MetaMask')
    ethereum.request({ method: 'eth_requestAccounts' })
  }

  const handleSwitchProvider = () => {
    console.log('switching provider')
    if (providerName === ProviderNames.FallbackProvider) {
      setContract(web3Contract)
    } else {
      setContract(defaultContract)
    }
  }

  const handleVote = () => {
    try {
      const vote = async () => {
        console.log('getting VOTE_FEE')
        const voteFee = await contract.VOTE_FEE()
        console.log('voting')
        const voting = await contract.functions.vote(BigNumber.from(2), {
          value: voteFee
        })
      }
      vote()
    } catch (error) {
      console.log(error)
    }
  }

  const handleCleanVotes = () => {
    try {
      const clean = async () => {
        console.log('clean votes')
        const voting = await contract.functions.clean()
      }
      clean()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Grid container spacing={3} justify="center">
          <Grid item xs={6} sm={3}>
            <StyledPaper square>
              <span>yes</span>
              {votes?.yes}
            </StyledPaper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StyledPaper square>
              <span>no</span>
              {votes?.yes}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App

const StyledPaper = styled(Paper)`
  align-items: center;
  color: red;
  display: flex;
  font-size: 100px;
  height: 200px;
  justify-content: center;
  position: relative;

  span {
    color: black;
    font-size: 30px;
    left: 5px;
    line-height: 1;
    position: absolute;
    text-transform: uppercase;
    top: 5px;
  }
`
