import {
  AppBar, Button, Container, Divider, IconButton, Link, Menu,
  MenuItem, Stack, Tooltip, Typography
} from '@mui/material'
import type { MouseEvent } from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'
import Image from 'next/image'

const DemonWalletConnectButton = dynamic(
  async () =>
    (await import("@renec-foundation/wallet-adapter-react")).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  const supportLink = 'https://renec.foundation/support';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])
  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  // const handleToggleTheme = useCallback(() => {
  //   toggleThemeMode()
  //   handleClose()
  // }, [toggleThemeMode, handleClose])

 
  return (
    <Container className="h-16 px-4">
      <AppBar color="transparent" className="shadow-none bg-top-nav">
        <Container className="h-16">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="w-full h-full"
          >
            <Stack direction="row" justifyContent="start" alignItems="center">
              <Stack>
                <Image src="/logo.png" alt="Dapp Starter" width="50" height="50" />
              </Stack>
              <Stack className="ml-4 sm:ml-16">
                <Link color="inherit" href={supportLink} target="_blank" rel="noreferrer" className="text-base font-normal">
                  Support
                </Link>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack className="px-2">
                <DemonWalletConnectButton />
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </AppBar>
    </Container>
  )
}

export default memo(Header)
