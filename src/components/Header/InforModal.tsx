import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import { Box, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { chainData } from '../../hooks/data'
import { useWeb3Context } from '../../hooks/web3Context'
import config from '../../utils/config'
import AccountIcon from '../AccountIcon/AccountIcon'
import { shortAddress } from '../../utils/tools'
import styles from './Header.module.scss'

interface Props {
  openAccount: boolean
  setOpenAccount: any
}

const InforModal = ({ openAccount, setOpenAccount }: Props) => {
  const dispatch = useDispatch<any>()

  const mobileView = useMediaQuery('(max-width:760px)')

  const userModule = useSelector((state: any) => state.userModule)
  const { user } = userModule
  const handleClose = () => setOpenAccount(false)

  const [copied, setCopied] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  const { /* connected,  */ chainID, address /* , connect */ } = useWeb3Context()

  const copyToRef = (e: any) => {
    e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()

    navigator.clipboard.writeText(config.websiteURL + '/?ref=' + user.userRef)
    setCopiedRef(true)

    setTimeout(() => {
      setCopiedRef(false)
    }, 500)
  }

  const copyToClipBoard = (e: any) => {
    e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()

    navigator.clipboard.writeText(address)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 500)
  }
  const [discord, setDiscord] = useState('asdfasdf')
  useEffect(() => {
    setDiscord(user.discord)
  }, [user.discord])

  return (
    <>
      <Modal
        open={openAccount && Boolean(address)}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <div className={styles.header}>
            <div className={styles.title}>
              <div>Account</div>
            </div>
            {/* <div className={styles.close} onClick={handleClose}>
              <img alt="" src="/images/support/support_md_close_btn.png" />
            </div> */}
          </div>

          <div className={styles.hr}></div>
          <div style={{ padding: '0rem 1rem' }}>
            <div className={styles.modalContents}>
              <div
                style={{
                  fontWeight: '500',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '8px',
                  }}
                >
                  <AccountIcon address={address} size={20} />
                </span>
                <span>{shortAddress(address)}</span>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: mobileView ? 'column' : 'row nowrap',
                    alignItems: 'center',
                  }}
                >
                  {!copied && (
                    <div
                      className={styles.copyAddress}
                      onClick={copyToClipBoard}
                    >
                      <ContentCopyIcon sx={{ width: '17px' }} />
                      <span>Copy Address</span>
                    </div>
                  )}
                  {copied && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TaskAltRoundedIcon sx={{ width: '17px' }} />
                      &nbsp;Copied
                    </div>
                  )}

                  {chainData[chainID as keyof object] && (
                    <div style={{ marginLeft: '20px' }}>
                      <a
                        href={
                          chainData[chainID as keyof object]['explorer'] +
                          '/address/' +
                          address
                        }
                        className={styles.viewOnExplorer}
                      >
                        <OpenInNewIcon />
                        <span>View on Explorer</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  alignItems: 'center',
                }}
              >
                <p style={{ display: 'flex', alignItems: 'center' }}>
                  Referral Link &nbsp;
                  {!copiedRef && (
                    <ContentCopyIcon
                      sx={{ width: '17px', cursor: 'pointer' }}
                      onClick={copyToRef}
                    />
                  )}
                  {copiedRef && <TaskAltRoundedIcon sx={{ width: '17px' }} />}
                </p>
                <p>{config.websiteURL + '/?ref=' + user.userRef}</p>
                <Box>
                  <p>Referrals: {user.referrals}</p>
                </Box>
              </Box>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default InforModal
