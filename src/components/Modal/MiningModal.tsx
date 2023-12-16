import { Grid, Stack } from '@mui/material'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ADMIN_WALLET_ADDRESS,
  FEE_WALLET_ADDRESS,
  chainId,
} from '../../hooks/constants'
import { deposit, sendToken } from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  buyLevel,
  checkCooldown,
  checkUpgradeAvailable,
  claimDrg,
  /* checkWithdrawableReqeust,  */ depositRequest,
  meatRequest,
  setCooldown,
  withdrawRequest,
  getMiningStatus,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
// import { Withdraw } from "../../store/user/action-types";
// import api from '../../utils/callApi';
import { getBcsPrice, getWithdrewDrgAmount } from '../../utils/user'
import { global } from '../../common/global'
import { setDefaultResultOrder } from 'dns'
import userEvent from '@testing-library/user-event'
import { getProfile } from '../../common/api'
import { convertSecToHMS } from '../../utils/tools'

interface Props {
  open: boolean
  setOpen: any
  drgAmount: number
  meat: any
  setDrgAmount: any
  setEggs: any
  egg: any
  onExchange: any
  onExchangeEgg: any
  levelState: number
  setLevelState: any
}

const MiningModal = ({
  open,
  setOpen,
  drgAmount,
  meat,
  setDrgAmount,
  setEggs,
  egg,
  onExchange,
  onExchangeEgg,
  levelState,
  setLevelState
}: Props) => {

  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [bcsAmount, setBCSAmount] = useState(0)
  const [withdrawableBcsAmount, setWithdrawableBcsAmount] = useState<number>(0)
  const [value, setValue] = React.useState(0)

  const [btnType, setBtnType] = React.useState('Start')
  const [upgradeTab, setUpgradeTab] = React.useState(false)
  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const [displayLevel, setDisplayLevel] = useState(-1)

  const [upgradeErrorFlag, setUpgradeErrorFlag] = useState(false)
  const [miningStatus, setMiningStatus] = useState(user.miningStatus);

  useEffect(() => {  
    if (user.miningStatus === false) {
      setBtnType("BUY")
    }
  }, [address])

  useEffect(() => {
    if (address !== '') {
      dispatch(
        checkCooldown(address, 'level-up', (res: any) => {
          let cooldownSec = res.data
          if (cooldownSec === 999999) {
            // if(miningStatus === false) return
            // setBtnType('Start')
          }
          else if (cooldownSec <= 0) {
            setRemainedTime(0);
            setBtnType("Claim");
          }
          else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }
        }),
      )
    }
  }, [address])

  useEffect(() => {
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {
            setBtnType('Claim')
          }
          if (prevTime === 0) {
            clearInterval(cooldownInterval)
            setIsCooldownStarted(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(cooldownInterval)
  }, [isCooldownStarted])

  useEffect(() => {
    ; (async () => {
      const withdrewdrgAmount = getWithdrewDrgAmount(user.withdraws) // Drg
      const bcsPrice = 1
      const maxAmount =
        (checkPremium(user.premium).isPremium ? 10 : 5) / bcsPrice
      setWithdrawableBcsAmount(maxAmount - Math.floor(withdrewdrgAmount / 10))
    })()
  }, [user.withdraws])

  const onButtonClick = async () => {
    if (btnType === "BUY") {
      dispatch(
        getMiningStatus(address, (res: any) => {
          setBtnType("Start")
          setMiningStatus(true)
          setDrgAmount(res.data.Drg)
        })
      )
    }
    else {
      if (remainedTime > 0) {
        return
      }
      if (btnType === 'Start') {
        dispatch(
          setCooldown(address, 'level-up', true, (res: any) => {
            if (!isCooldownStarted) {
              setDrgAmount(res.data);
              setRemainedTime(30)
              setIsCooldownStarted(true)
            }
          }),
        )
      } else if (btnType === 'Claim') {
        dispatch(claimDrg(address, (res: any) => {
          setDrgAmount(res.data.drg)
          setEggs(res.data.eggs)
          setBtnType('Start')
        }))
      }
    }
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 150,
      md: 650,
    },
  }
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img alt="" src="/images/support/support_md_bg.png" />

          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '6%',
              transform: 'translate(26%, -27%)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onClick={handleClose}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box>
              <div
                style={{
                  fontFamily: 'CubicPixel',
                  fontWeight: 'bold',
                  fontSize: '40px',
                  textAlign: 'center',
                  marginTop: '8%',
                  color: '#e7e1e1',
                  lineHeight: '100%',
                }}
              >
                <p>DRAGON PLACE{upgradeTab && ' UPGRADE'}</p>
              </div>
            </Box>
            <Grid
              container
              spacing={3}
              sx={{
                padding: '8% 6% 20% 8%',
                width: '100%',
                height: '36%',
                margin: 0,
                justifyContent: 'center',
              }}
            >
              <Grid item xs={4} sx={{ padding: '0 !important' }}>
                <Stack
                  sx={{
                    fontFamily: 'CubicPixel',
                    fontSize: '30px',
                    width: '200%',
                    marginLeft: "-50%",
                    fontWeight: 'bold',
                    color: '#e7e1e1',
                    textAlign: 'center',
                    marginTop: "-20px"
                  }}
                >
                  <p>YOU WILL RECEIVE:</p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '100px', height: '100px',
                        lineHeight: '1',
                        backgroundImage: 'radial-gradient(farthest-corner at 30px 70px,#71923c, #ebd8c2 )',
                        padding: '23px 0',
                        margin: "10px",
                        border: "3px solid black",
                        borderRadius: '23px',
                        fontSize: "smaller"
                      }}
                    >
                      <p>50<br />DRG</p>
                    </div>
                    <div
                      style={{
                        width: '100px', height: '100px',
                        backgroundImage: 'radial-gradient(farthest-corner at 30px 70px,#71923c, #ebd8c2 )',
                        padding: '10px',
                        margin: "10px",
                        border: "3px solid black",
                        borderRadius: '23px'
                      }}
                    >
                      <img src='assets/images/egg.png' width={"80px"} />
                    </div>
                  </div>
                </Stack>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <Button
                onClick={() => onButtonClick()}
                sx={{
                  width: '200px',
                  marginTop: "30px"

                }}
              >
                <img alt="" src="/assets/images/big-button.png" />
                <p
                  style={{
                    position: 'absolute',
                    fontFamily: 'CubicPixel',
                    fontSize: '25px',
                    textAlign: 'center',
                    color: '#e7e1e1',

                  }}
                >
                  {miningStatus === false ? "BUY" : (remainedTime === 0 ? btnType : convertSecToHMS(remainedTime))}
                </p>
              </Button>
            </Box>
            <div style={{
              fontFamily: 'CubicPixel',
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#e7e1e1',
              textAlign: 'center',
            }}>
              <p>{miningStatus === false ? "500 DRG" : "25 DRG"}</p>
            </div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                bottom: '6%',
                width: '100%'
              }}
            >
              <div style={{
                fontFamily: 'CubicPixel',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#e7e1e1',
                textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <img src='assets/images/alert_.png' style={{ marginTop: "-9px", width: "30px", height: "30px" }}></img>
                <p style={{ textShadow: '1px 1px black' }}>ONCE YOU BUY IT YOU CAN RUN IT AN INFINITE NUMBER OF TIMES</p>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default MiningModal
