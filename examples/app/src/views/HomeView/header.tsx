import { useCallback, useState, memo, useEffect, useMemo } from 'react'
import type { MouseEvent } from 'react'
import {
  Container,
  Stack,
  AppBar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Tooltip,
  Link,
} from '@mui/material'

import Image from 'next/image'
import dynamic from 'next/dynamic'

const DemonWalletConnectButton = dynamic(
  async () => (await import('../../components/WalletButton/WalletMultiButton')).WalletMultiButton,
  { ssr: false },
)

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
    <Container className="px-4 h-16">
      <AppBar color="transparent" className="bg-top-nav shadow-none">
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
                <DemonWalletConnectButton className="text-black dark:text-white hover:text-white" />
              </Stack>
              
            </Stack>
          </Stack>
        </Container>
      </AppBar>
    </Container>
  )
}

export default memo(Header)
