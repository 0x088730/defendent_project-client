import { Box, Grid, Button, Typography, Stack } from '@mui/material'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import ExchangeModal from '../../components/Header/ExchangeModal'
import Header from '../../components/Header/Header'
import DepositModal from '../../components/Modal/DepositModal'
import InstructionModal from '../../components/Modal/InstructionModal'
import MiningModal from '../../components/Modal/MiningModal'
import { STAKE_TIMER } from '../../hooks/constants'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  claimDiamond,
  stakeDiamond,
  swapEggs,
  swapMeats,
  upgradeWall,
  checkCooldown,
} from '../../store/user/actions'

import styles from './Main.module.scss'
import UpgradeWallModal from '../../components/Header/UpgradeWallModal'
import { global } from '../../common/global'
import RockModal from '../../components/Header/RockModal'
import ConvertModal from '../../components/Modal/ConvertModal'
import { getProfile } from '../../common/api'
import store from '../../store'
import { setLoadingStatus } from '../../common/state/game/reducer'
import { RingLoader } from 'react-spinners';
import DragonTownModal from '../../components/Modal/DragonTownModal'

interface MainProps {
  showAccount: any
  setShowAccount: any
}

const Main = ({ showAccount, setShowAccount }: MainProps) => {
  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)
  const navigate = useNavigate();

  const { user } = userModule
  const { connected, chainID, address, connect } = useWeb3Context()

  const [convertModalOpen, setConvertModalOpen] = React.useState(false)
  const [townModalOpen, setTownModalOpen] = useState(false);

  const [Drg, setDrg] = useState(0)
  const [eggs, setEggs] = useState(0)
  const [meat, setMeat] = useState(0)
  const [wallLevelState, setWallLevelState] = useState(1)

  const [openInstruction, setOpenInstruction] = useState(false)

  useEffect(() => {
    if (global.wall === 0) {
      history.back();
    }
  })
  useEffect(() => {
    if (address) {
      getProfile(address, "dragon").then(() => {
        setDrg(userModule.user.Drg);
        setEggs(userModule.user.eggs);
        setMeat(userModule.user.meat);
        setWallLevelState(userModule.user.wall)
      })
    }
    setTimeout(() => {
      if (address && wallLevelState !== 0) store.dispatch(setLoadingStatus(false));
      else navigate("/", { replace: true });
    }, 2000)
  }, [])

  useEffect(() => {
    setDrg(userModule.user.Drg);
    setEggs(userModule.user.eggs);
    setMeat(userModule.user.meat);
    setWallLevelState(userModule.user.wall)
  }, [userModule.user.Drg, userModule.user.eggs, userModule.user.meat, userModule.user.wall])

  const TEST_MODE = true

  const [openSwap, setOpenSwap] = useState(false)
  const [openUpgradeWall, setOpenUpgradeWall] = useState(false)
  const [openRock, setOpenRock] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openMining, setOpenMining] = useState(false)
  const [levelState, setLevelState] = React.useState(global.level)


  const [btnTitle, setBtnTitle] = useState("START")
  const [items, setItems] = useState([
    { counting: 0, timer: 0, },
    { counting: 0, timer: 0, },
    { counting: 0, timer: 0, },
  ])

  const [birds, setBirds] = useState([
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
  ])
  const diamonds = [1, 2]
  const [selectedIndex, setSelectedIndex] = useState(0)

  const showModal = (index: any) => {
    if (Drg < 20) {
      return
    }
    setSelectedIndex(index)
    handleOpen()
  }

  const showBirdModal = () => {
    handleBirdOpen()
  }

  const onRockStart = (cooldown: any) => {
    dispatch(
      stakeDiamond(address, selectedIndex, cooldown, (res: any) => {
        if (res.success === false) return
        setDrg(res.data)
        handleClose()
        coolDownStatus(cooldown)
      }),
    )
  }
  useEffect(() => {
    coolDownStatus(selectedIndex)
  }, [selectedIndex])
  const coolDownStatus = (cooldown: any) => {
    if (address !== '') {
      dispatch(
        checkCooldown(address, `diamond${selectedIndex + 1}`, (res: any) => {
          let cooldownSec = res.data
          const _items = [...items]
          _items[selectedIndex].timer = res.data
          _items[selectedIndex].counting = 1
          setItems(_items)
          if (cooldownSec === 999999) {
            _items[selectedIndex].timer = 0
          }
          else if (cooldownSec <= 0) {
            _items[selectedIndex].timer = 0
            setBtnTitle("CLAIM")
          }
          else {
            _items[selectedIndex].timer = cooldownSec
          }
        }),
      )
    }
  }

  const onRockClaim = () => {
    if (items[selectedIndex].counting !== 0 && items[selectedIndex].timer === 0) {
      setOpenRock(false)
      onClaim(selectedIndex)
    } else alert('please wait...')
  }

  const onClaim = (index: number) => {
    dispatch(
      claimDiamond(address, index, (res: any) => {
        if (res.success === false) return setMeat(meat)
        const _items = [...items]
        _items[index].counting = 0
        _items[index].timer = 0
        if (typeof res.data.meat === 'number') setMeat(res.data.meat)
        setItems(_items)
        setBtnTitle("START")
      }),
    )
  }

  const onExchange = (swapAmount: number) => {
    dispatch(swapMeats(address, swapAmount, (res: any) => { }))
    setOpenSwap(false)
  }

  const onExchangeEgg = (swapAmount: number) => {
    dispatch(swapEggs(address, swapAmount, (res: any) => { }))
    setOpenSwap(false)
  }

  const onUpgradeWall = () => {
    dispatch(
      upgradeWall(address, (res: any) => {
        setWallLevelState(res.wall)
        global.wall = res.wall
        setDrg(res.Drg)
      }),
    )
    setOpenUpgradeWall(false)
  }

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpenRock(true)
  const handleClose = () => setOpen(false)

  const handleBirdOpen = () => setConvertModalOpen(true)
  const handleBirdClose = () => setConvertModalOpen(false)
  let timer: any = null
  const startTimer = () => {
    if (timer === null) {
      timer = setInterval(() => {
        setItems((prevItem) => {
          let _item = [...prevItem]
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--
            return value
          })
          return _item
        })

        setBirds((prevItem) => {
          let _item = [...prevItem]
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--
            return value
          })
          return _item
        })
      }, 1000)
    }
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 200,
      sm: 400,
      // md: 800,
      md: 665,
    },

    border: 'none',
    outline: 'none',
    // maxHeight: '500px',
    // overflow: 'auto',
    overflow: 'initial',
    // boxShadow: 24,
    // p: 4,
  }

  useEffect(() => {
    startTimer()

    return () => clearInterval(timer)
  }, [JSON.stringify(items)])

  // set staked diamond
  useEffect(() => {
    if (user.stakedDiamond && user.stakedDiamond.length > 0) {
      const _items = [...items]
      for (const dt of user.stakedDiamond) {
        if (!dt || dt.position > 7) continue

        const date = new Date()
        const curSec = date.getTime()
        const endSec = new Date(dt.staked_at).getTime()

        const eDate = new Date(dt.staked_at)

        _items[dt.position].counting = dt.diamond
        _items[dt.position].timer =
          STAKE_TIMER - Math.floor((curSec - endSec) / 1000)
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0
      }
      setItems(_items)
    }
  }, [JSON.stringify(user.stakedDiamond)])

  useEffect(() => {
    if (user.stakedBirds && user.stakedBirds.length > 0) {
      const _items = [...birds]
      for (const dt of user.stakedBirds) {
        if (!dt) continue
        if (dt.position >= 10) continue

        const date = new Date()
        const curSec = date.getTime()
        const endSec = new Date(dt.staked_at).getTime()

        _items[dt.position].item = 1
        _items[dt.position].timer =
          STAKE_TIMER - Math.floor((curSec - endSec) / 1000)
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0
      }
      setBirds(_items)
    }
  }, [JSON.stringify(user.stakedBirds)])

  return (
    <>
      {isLoading === true ?
        <div style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
          <RingLoader color="#36D7B7" loading={isLoading} size={150} style={{ position: 'absolute', top: '40vh', left: '45vw' }} />
        </div>
        :
        <>
          <Box className="Main">
            <Header
              showAccount={showAccount}
              setShowAccount={setShowAccount}
              Drg={Drg}
              eggs={eggs}
              meat={meat}
            />

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...style, width: { sm: 400, md: 400 } }}>
                <Grid container spacing={3}>
                  {diamonds.map((item, index) => (
                    <Grid
                      item
                      key={index}
                      xs={6}
                      sm={6}
                      md={6}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100px',
                          cursor: 'pointer',
                        }}
                      >
                        {item === 1 && <img alt="" src="/images/diamond_1.png" />}
                        {item === 2 && <img alt="" src="/images/diamond_2.png" />}

                        <Box sx={{ textAlign: 'center' }}>
                          <Button
                            sx={{
                              padding: '10px 4px',
                            }}
                            variant="contained"
                            color="success"
                            onClick={(e) => onRockStart(item)}
                          >
                            20 Drg
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Modal>

            <ConvertModal
              convertModalOpen={convertModalOpen}
              setConvertModalOpen={setConvertModalOpen}
              Drg={Drg}
              setDrg={setDrg}
              eggs={eggs}
              setEggs={setEggs}
              meat={meat}
              setMeat={setMeat}
            />
            <ExchangeModal
              open={openSwap}
              setOpen={setOpenSwap}
              Drg={Drg}
              egg={eggs}
              setDrg={setDrg}
              setEgg={setEggs}
            />
            <UpgradeWallModal
              open={openUpgradeWall}
              setOpen={setOpenUpgradeWall}
              setWall={onUpgradeWall}
            />
            <RockModal
              openRock={openRock}
              counting={items[selectedIndex].counting}
              timer={items[selectedIndex].timer}
              setOpen={setOpenRock}
              onRock={() => onRockStart(1)}
              setRockClaim={onRockClaim}
              btnTitle={btnTitle}
            />
            <DragonTownModal
              townModalOpen={townModalOpen}
              setTownModalOpen={setTownModalOpen}
              drg={Drg}
              setDrg={setDrg}
              eggs={eggs}
              setEggs={setEggs}
            />
            <MiningModal
              open={openMining}
              setOpen={setOpenMining}
              drgAmount={Drg}
              setDrgAmount={setDrg}
              meat={meat}
              egg={eggs}
              setEggs={setEggs}
              levelState={levelState}
              setLevelState={setLevelState}
              onExchange={onExchange}
              onExchangeEgg={onExchangeEgg}
            />

            <InstructionModal open={openInstruction} setOpen={setOpenInstruction} />

            <Box
              sx={{
                pointerEvents: `${TEST_MODE || connected ? '' : 'none'}`,
                height: '90%',
              }}
            >
              <div
                className="wall-wallet"
                style={{ minWidth: '1600px', minHeight: '900px' }}
              // style={{ backgroundImage:"url('/images/border"+(wallLevelState)+".png')" }}
              >
                <img
                  src={'assets/images/border' + wallLevelState + '.png'}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    cursor: 'pointer',
                    minWidth: '1600px',
                    minHeight: '900px'
                  }}
                  // onClick={() => setOpenUpgradeWall(true)}
                  className={styles.item}
                />
                <Box
                  sx={{
                    width: '50%',
                    paddingTop: '500px',
                    // transform: 'translateY(-20vh)',                

                    justifyContent: 'space-between',
                    margin: 'auto',
                    display: 'flex',
                    zIndex: 20,
                  }}
                >
                  <Box
                    sx={{
                      cursor: 'pointer',
                      transform: 'translateY(-100px)',
                      height: 'fit-content',

                      zIndex: 20,
                    }}
                    onClick={(e) => setOpenSwap(true)}
                  >
                    <img alt="" src="/images/storage.png" style={{ transform: 'translate(-50%, -50%)' }} className={styles.item} />
                  </Box>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      transform: 'translate(20px, 20px)',
                      height: 'fit-content',
                      zIndex: 20,
                    }}
                    onClick={(e) => setTownModalOpen(true)}
                  >
                    <img alt="" src="/images/home.png" style={{ transform: 'translate(-50%, -50%)', maxWidth: '250px' }} className={styles.item} />
                  </Box>
                  <Box
                    sx={{
                      // left: `${Math.max(innerWidth, 1200) / 2 - 75}px`,
                      zIndex: 20,
                      transform: 'translateY(200px)',
                      height: 'fit-content',
                      width: 'fit-content',

                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      showBirdModal()
                    }}
                  >
                    <img
                      alt=""
                      className={styles.item}
                      style={{ transform: 'translate(-5%, -115%)' }}
                      width={'80%'}
                      src={`/images/bird_place.png`}
                    />
                  </Box>
                  <Box
                    sx={{
                      zIndex: 20,
                      transform: 'translate(100%, -180px)',
                      height: 'fit-content',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => setOpenMining(true)}
                  >
                    <img alt="" src="/images/mining.png" style={{ transform: 'translate(-50%, -50%)' }} className={styles.item} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    width: '30%',
                    margin: 'auto',
                    top: '25%',
                    left: '50%',
                    transform: "translateX(-50%)"
                  }}
                >
                  {items.map((item, index) => (
                    <Box
                      sx={{

                        // left:
                        //   windowSize.width < MIN_SCREEN
                        //     ? MIN_SCREEN - parseInt(item.posy, 10) - 30 + 'px'
                        //     : Math.max(900, windowSize.width - 450 ) - parseInt(item.posy, 10) + 'px',
                        cursor: 'pointer',
                        margin: 'auto',
                      }}
                      onClick={(e) => {
                        showModal(index)
                      }}
                      key={index}
                    >
                      {/* {item.item === 0 ? ( */}
                      <Box
                        sx={{
                          zIndex: 10,
                          transform: index === 1 ? 'translateY(-30%) ' : index === 2 ? 'translateY(30%) ' : ''
                        }}
                      >
                        <img
                          alt=""
                          className={styles.item}
                          width={'100'}
                          // width={index===1?150:100}
                          src={`/images/place_1.png`}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* </div> */}
              </div>
            </Box>

            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', left: '2%', top: '55%' }}
                src={`/images/greentree1.png`}
              />
            </Box>
            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', left: '15%', top: '65%', width: '280px', height: '300px' }}
                src={`/images/pinktree.png`}
              />
            </Box>
            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', right: '5%', top: '55%', }}
                src={`/images/greentree2.png`}
              />
            </Box>
            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', left: '50%', bottom: '-5%', }}
                src={`/images/rock.png`}
              />
            </Box>
          </Box >

          <Box
            className={styles.loginbg}
            sx={{
              display: TEST_MODE || connected ? 'none' : 'block',
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(0, -50%)',
                justifyContent: 'center',
                width: '100vw',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  width: '12vw',
                  minWidth: '100px',
                  maxWidth: '180px',
                }}
              >
                <img alt="" src="/images/login_icon.png" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box className={styles.icon_buttons}>
                  <Button
                    sx={{ mb: 1, width: '100%' }}
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      connect()
                    }}
                  >
                    <img alt="" src="/images/icon_metamask.png" />
                    Connect Metamask
                  </Button>
                </Box>
                <Box className={styles.icon_buttons}>
                  <a
                    className={styles.link}
                    href="https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B"
                  >
                    <Button
                      sx={{ width: '100%', justifyContent: 'left', mb: 1 }}
                      variant="contained"
                      color="success"
                    >
                      <img alt="" src="/images/icon_bcs.png" />
                      Buy/Sell BCS
                    </Button>
                  </a>
                </Box>
                <Box className={styles.icon_buttons}>
                  <Button
                    sx={{ width: '100%', justifyContent: 'left', mb: 1 }}
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      setOpenInstruction(true)
                    }}
                  >
                    <img alt="" src="/images/icon_youtube.png" />
                    INSTRUCTION
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      }
    </>
  )
}

export default Main
