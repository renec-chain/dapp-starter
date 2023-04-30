import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
// import { E2EWalletAdapter } from 'e2e-react-adapter'
import { Keypair } from '@solana/web3.js'
import { getRpcEndpointUrl } from '../../constants'
import { DemonWalletAdapter } from '../../wallet/adapter'

const Provider = ({ children }: HocProps) => {
  const wallets = useMemo(() => {
    const supportedWallets = [new SolflareWalletAdapter(), new DemonWalletAdapter()]

    return supportedWallets
  }, [])

  return (
    <ConnectionProvider endpoint={getRpcEndpointUrl()}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Provider
