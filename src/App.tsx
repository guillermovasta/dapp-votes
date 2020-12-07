import React, { useEffect, useState } from 'react'
import { Contract, BigNumber } from 'ethers'
import styled from 'styled-components'
import {
  Container,
  Grid,
  Paper,
  ThemeProvider,
  CssBaseline,
  LinearProgress
} from '@material-ui/core'
import {
  createDefaultContractInstance,
  createWeb3ContractInstance
} from './utils'
import { theme, colors } from './styles/theme'
import { walletAddress } from './constants'

enum Vote {
  yes = 2,
  no = 1
}

enum ProviderNames {
  Web3Provider = 'Web3Provider',
  EtherscanProvider = 'EtherscanProvider'
}

const App = () => {
  const ethereum = (window as any).ethereum
  const web3Contract = createWeb3ContractInstance(ethereum)
  const defaultContract = createDefaultContractInstance()

  const [votesForYes, setVotesForYes] = useState<number>(0)
  const [votesForNo, setVotesForNo] = useState<number>(0)
  const [voted, setVoted] = useState<boolean | undefined>(undefined)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const [contract, setContract] = useState<Contract>(defaultContract)

  const providerName = contract.provider.constructor.name

  useEffect(() => {
    const getVote = async () => {
      try {
        setIsFetching(true)
        const vote = await contract.functions.getVote(walletAddress)
        setIsFetching(false)
        // if (BigNumber.from(vote).toNumber() !== 0) {
        if (parseInt(vote) !== 0) {
          setVoted(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getVote()
  }, [contract])

  useEffect(() => {
    const getVotes = async () => {
      try {
        setIsFetching(true)
        const votesForYes = await contract.votesForYes()
        const votesForNo = await contract.votesForNo()
        setIsFetching(false)
        setVotesForYes(BigNumber.from(votesForYes).toNumber())
        setVotesForNo(BigNumber.from(votesForNo).toNumber())
      } catch (error) {
        console.log(error)
      }
    }
    getVotes()
  }, [contract])

  useEffect(() => {
    const voteCastedListener = (proposalId: any, from: any, vote: any) => {
      console.log('event received')
      if (BigNumber.from(vote).toNumber() === Vote.yes) {
        setVotesForYes(votesForYes + 1)
      } else {
        setVotesForNo(votesForNo + 1)
      }
    }
    contract.on('VoteCasted', voteCastedListener)
    return () => {
      contract.off('VoteCasted', voteCastedListener)
    }
  }, [contract, votesForNo, votesForYes])

  const handleConnectToMetaMask = () => {
    ethereum.request({ method: 'eth_requestAccounts' })
  }

  const handleSwitchProvider = () => {
    if (providerName === ProviderNames.EtherscanProvider) {
      setContract(web3Contract)
    } else {
      setContract(defaultContract)
    }
  }

  const handleVote = (choice: number) => {
    try {
      const vote = async () => {
        setIsFetching(true)
        const voteFee = await contract.VOTE_FEE()
        const voting = await contract.functions.vote(BigNumber.from(choice), {
          value: voteFee
        })
        await voting.wait()
        setIsFetching(false)
        setVoted(true)
      }
      if (!voted) {
        vote()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCleanVotes = () => {
    try {
      const clean = async () => {
        setIsFetching(true)
        const cleaning = await contract.functions.clean()
        await cleaning.wait()
        setIsFetching(false)
        setVotesForYes(0)
        setVotesForNo(0)
        setVoted(false)
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
            <StyledPaper elevation={3} onClick={() => handleVote(Vote.yes)}>
              <span>YES</span>
              {votesForYes}
            </StyledPaper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StyledPaper elevation={3} onClick={() => handleVote(Vote.no)}>
              <span>NO</span>
              {votesForNo}
            </StyledPaper>
          </Grid>
        </Grid>
        <div>
          <ActionBar>
            <Button onClick={handleCleanVotes}>Clean Votes</Button>
            <Button onClick={handleSwitchProvider}>Switch Provider</Button>
            <Button onClick={handleConnectToMetaMask}>Connect MetaMask</Button>
          </ActionBar>
        </div>
        {isFetching && <LinearProgress />}
      </Container>
    </ThemeProvider>
  )
}

export default App

const StyledPaper = styled(Paper)`
  align-items: center;
  background-color: ${colors.dark};
  color: ${colors.green};
  cursor: pointer;
  display: flex;
  font-size: 100px;
  height: 200px;
  justify-content: center;
  position: relative;

  &:hover {
    opacity: 0.9;
  }

  span {
    color: ${colors.light};
    font-size: 24px;
    font-weight: 300;
    left: 10px;
    line-height: 1;
    position: absolute;
    top: 10px;
  }
`

const ActionBar = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0;

  button {
    margin-left: 3px;

    &:first-child {
      margin-left: 0;
    }
  }
`

const Button = styled.button`
  background-color: ${colors.dark};
  border: 0;
  border-radius: 5px;
  color: ${colors.light};
  cursor: pointer;
  padding: 10px;

  &:hover {
    opacity: 0.9;
  }
`
