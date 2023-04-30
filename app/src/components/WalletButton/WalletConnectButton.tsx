import { useWallet } from '@solana/wallet-adapter-react'
import type { FC, MouseEventHandler } from 'react'
import React, { useCallback, useMemo } from 'react'
import { useConnectWallet } from 'hooks/use-connect-wallet'
import type { ButtonProps } from '../Button'
import { Button } from '../Button'
import { WalletIcon } from './WalletIcon'

export const WalletConnectButton: FC<ButtonProps> = ({ children, disabled, onClick, ...props }) => {
  const { wallet, connecting, connected } = useWallet()
  const connectWallet = useConnectWallet()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        connectWallet()
      }
    },
    [connectWallet],
  )

  const content = useMemo(() => {
    if (children) return children
    if (connecting) return  "Connecting..."
    if (connected) return "Connected"
    if (wallet) return "Connect"
    return "Connect Wallet"
  }, [children, connecting, connected, wallet])

  return (
    <Button
      className="wallet-adapter-button-trigger"
      startIcon={wallet ? <WalletIcon wallet={wallet} /> : undefined}
      onClick={handleClick}
      {...props}
    >
      {content}
    </Button>
  )
}
