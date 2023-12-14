import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  checkCooldown,
  claimHunter,
  levelupHunter,
  startMineTownCooldown,
} from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { global } from '../../common/global'
import "./modal.css"
import SelectEggModal from './selectEggModal'
import DragonChooseModal from './DragonChooseModal'
import store from '../../store'
import { setRewards } from '../../common/state/game/reducer'
import { convertSecToHMS } from '../../utils/tools'

interface Props {
  open: any
  setOpen: any
  Drg: any
  egg: any
  setDrg: any
  setEgg: any
}

const ExchangeModal = ({
  open,
  setOpen,
  Drg,
  egg,
  setDrg,
  setEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const rewards = useSelector((state: any) => state.app.game.rewards)

  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const dispatch = useDispatch<any>()
  const [btnType, setBtnType] = useState('Start')
  const [cooldownCount, setCooldownCount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [eggModalOpen, setEggModalOpen] = useState(false);
  const [dragonChooseModalOpen, setDragonChooseModalOpen] = useState(false);
  const [cardNum, setCardNum] = useState("0");
  const initialState = {
    first: { name: '', url: '', reward: 0 },
    second: { name: '', url: '', reward: 0 },
    third: { name: '', url: '', reward: 0 },
  }
  const [cardImg, setCardImg] = useState(initialState);
  const [rewardValue, setRewardValue] = useState(0);

  useEffect(() => {
    let devideTime = remainedTime % 30;
    let count = Math.floor(remainedTime / 30);
    if (isCooldownStarted === true && devideTime === 0 && count < cooldownCount) {
      setRewardValue(rewardValue + rewardAmount);
    }
  }, [remainedTime])

  const onBtnClick = () => {
    if (remainedTime > 0)
      return
    if (btnType === 'Start') {
      if (cooldownCount === 0) {
        alert("Input Count of Eggs")
        return
      }
      if (egg < cooldownCount || egg <= 0) {
        alert("Not Enough Drg")
        return
      }
      if (rewardAmount === 0) {
        alert("Please Choose Dragon")
        return
      }
      store.dispatch(setRewards(rewardAmount))
      dispatch(
        startMineTownCooldown(address, cooldownCount, rewardAmount, cardImg, (resp: any) => {
          if (resp.data !== undefined || resp.data !== null) {
            setRemainedTime(30 * cooldownCount)
            setIsCooldownStarted(true)
            setEgg(resp.data)
          }
        }),
      )
    } else if (btnType === 'Claim') {
      setRewardAmount(0);
      setRewardValue(0);
      store.dispatch(setRewards(0))
      dispatch(
        claimHunter(address, (resp: any) => {
          setBtnType('Start')
          setDrg(resp.data.drg);
          setCardImg(initialState);
        }),
      )
    }
  }
  const handleClose = () => setOpen(false)
  useEffect(() => {
    if (isCooldownStarted && address !== '') {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {
            setBtnType('Claim')
            dispatch(
              checkCooldown(address, 'hunter-level-up', (res: any) => {
                let cooldownSec = res.data.time;
                if (Number.isNaN(res.data.count) || res.data.count === undefined) {
                  setCooldownCount(0)
                  return
                }
                setCooldownCount(res.data.count);
                setRewardAmount(res.data.rewardAmount)
                setCardImg(res.data.cardImg)
                if (cooldownSec === false) {
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)

                  setBtnType('Start')
                } else if (cooldownSec <= 0) {
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)

                  setBtnType('Claim')
                } else {
                  setRemainedTime(cooldownSec)
                  setIsCooldownStarted(true)
                }
              }),
            )
          }
          if (prevTime === 0) {
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(cooldownInterval)
  }, [isCooldownStarted])
  useEffect(() => {
    if (open === true && address !== '')
      dispatch(
        checkCooldown(address, 'hunter-level-up', (res: any) => {
          let cooldownSec = res.data.time
          if (Number.isNaN(res.data.count) || res.data.count === undefined) {
            setCooldownCount(0)
            return
          }
          setCooldownCount(res.data.count);
          setRewardAmount(res.data.rewardAmount)
          setCardImg(res.data.cardImg)
          if (cooldownSec === false) {
            setRemainedTime(-1)
            setIsCooldownStarted(false)

            setBtnType('Start')
          } else if (cooldownSec <= 0) {
            setBtnType('Claim')
            setRemainedTime(-1)
            setIsCooldownStarted(false)

          } else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }
        }),
      )
  }, [open, dispatch])

  const dragonChoose = (order: any) => {
    if (btnType !== "Start" || remainedTime > 0) {
      return;
    }
    setCardNum(order);
    setDragonChooseModalOpen(true);
  }
  
  useEffect(() => {
    if (open === true && rewardValue === 0) {
      let count = Math.floor(remainedTime / 30) + 1;
      if (count < cooldownCount) {
        setRewardValue((cooldownCount - count) * rewardAmount);
      }
    }
  }, [remainedTime])
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 150,
      md: 700,
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
              width: '7%',
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
                <p>MINE TOWN</p>
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
              <div
                style={{
                  fontFamily: 'CubicPixel',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#e7e1e1',
                  width: "50%",
                  textAlign: "center"
                }}
              >
                <p>SELECT DRAGONS</p>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    width: '100%',
                    height: '36%',
                    margin: 0,
                    justifyContent: 'center',
                  }}
                >
                  <div className='selectBtn' onClick={() => dragonChoose("1")} style={{ backgroundImage: cardImg.first.url }}>+</div>
                  <div className='selectBtn' onClick={() => dragonChoose("2")} style={{ backgroundImage: cardImg.second.url }}>+</div>
                  <div className='selectBtn' onClick={() => dragonChoose("3")} style={{ backgroundImage: cardImg.third.url }}>+</div>
                </Grid>
              </div>
              <div
                style={{
                  fontFamily: 'CubicPixel',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#e7e1e1',
                  width: "50%",
                  textAlign: "center"
                }}
              >
                <p>
                  SELECT EGGS
                  <span
                    id="eggNum"
                    style={{
                      position: "absolute",
                      fontSize: "35px",
                      visibility: "visible",
                    }}
                  >
                    &nbsp;&nbsp;{cooldownCount}
                  </span>
                </p>
                <Grid
                  container
                  spacing={3}
                  sx={{
                    width: '100%',
                    height: '36%',
                    margin: 0,
                    justifyContent: 'center',
                  }}
                >
                  <div className='selectBtn' onClick={() => egg === 0 ? alert("Not Enough Eggs") : setEggModalOpen(true)}>+</div>
                </Grid>
              </div>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                margin: 0,
                alignItems: 'center',

              }}
            >
              <Button
                onClick={() => onBtnClick()}
                sx={{
                  width: '40%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: "70px",
                }}
              >
                <img alt="" src="/assets/images/big-button.png" />
                <p
                  style={{
                    position: 'absolute',
                    fontFamily: 'CubicPixel',
                    fontSize: '28px',
                    textAlign: 'center',
                    color: '#e7e1e1',
                    letterSpacing: "2px"
                  }}
                >
                  {remainedTime <= 0 ? btnType : convertSecToHMS(remainedTime)}
                </p>
              </Button>
              <div
                style={{
                  position: "absolute",
                  right: '170px',
                  bottom: '65px',
                  textAlign: "center"
                }}
              >
                <p style={{
                  fontFamily: 'CubicPixel',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#e7e1e1',
                }}>REWARD</p>
                <div
                  className='displayCenter'
                  style={{
                    width: '120px', height: '70px',
                    border: '2px solid #3b5c53',
                    borderRadius: '23px',
                    backgroundColor: '#e8ede9',
                    boxShadow: '2px 2px 5px #33a597',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'CubicPixel',
                      fontSize: '30px',
                      fontWeight: 'bold',
                      color: "#ff8a00",
                      textShadow: '1px 1px black'
                    }}
                  >
                    {rewardValue}
                  </span> &nbsp;
                  <span
                    style={{
                      fontFamily: 'CubicPixel',
                      fontSize: '30px',
                      fontWeight: 'bold',
                      color: "#f0f0f0",
                      textShadow: '1px 1px black'
                    }}
                  >
                    DRG
                  </span>
                </div>
              </div>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <SelectEggModal
        eggModalOpen={eggModalOpen}
        setEggModalOpen={setEggModalOpen}
        cooldownCount={cooldownCount}
        setCooldownCount={setCooldownCount}
        egg={egg}
      />
      <DragonChooseModal
        dragonChooseModalOpen={dragonChooseModalOpen}
        setDragonChooseModalOpen={setDragonChooseModalOpen}
        cardNum={cardNum}
        setDrg={setDrg}
        cardImg={cardImg}
        setCardImg={setCardImg}
        rewardAmount={rewardAmount}
        setRewardAmount={setRewardAmount}
      />
    </>
  )
}

export default ExchangeModal
