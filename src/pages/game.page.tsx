import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { setGameStatus, setLoadingStatus, setTurnFormat } from '../common/state/game/reducer'
import { ButtonComponent } from '../components/button.component'
import { GameHeaderComponent } from '../components/game-header.component'
import { useWeb3Context } from '../hooks/web3Context'
import { global } from '../common/global'
import store from '../store'
import InforModal from '../components/Header/InforModal'
import { getUserData } from '../store/user/actions'
import { onShowAlert } from '../store/utiles/actions'
import DragonModal from '../components/Header/DragonsModal'
import { RingLoader } from 'react-spinners';

interface HeaderProps {
  showAccount: any
  setShowAccount: Function
  onStart: any
  onAttack: any
  onInventory: any
  onDragon: any
}
export const GamePage = ({
  showAccount,
  setShowAccount,
  onStart,
  onAttack,
  onInventory,
  onDragon,
}: HeaderProps) => {
  // const battle = phaserGame.scene.keys.battle as Battle
  // const game = phaserGame.scene.keys.game as Game
  // const { onStart, onAttack, onInventory, onDragon } = props

  const gameState = useSelector((state: any) => state.app.game.gameState)
  const turn = useSelector((state: any) => state.app.game.turn)
  const atkBtnState = useSelector((state: any) => state.app.game.attackBtnState)
  const secondTurn = useSelector((state: any) => state.app.game.secondTurn)
  const thirdTurn = useSelector((state: any) => state.app.game.thirdTurn)
  const user = useSelector((state: any) => state.userModule)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)

  useEffect(() => {
    if(isLoading === true) document.body.style.backgroundImage = 'url(assets/background/loading.png)'
    if(isLoading === false) document.body.style.backgroundImage = 'url(assets/background/background.png)'
  }, [isLoading])
  const inventoryOpened = useSelector(
    (state: any) => state.app.game.inventoryOpened,
  )
  const dragonOpened = useSelector(
    (state: any) => state.app.game.dragonOpened,
  )
  const location = useLocation()
  const ref = new URLSearchParams(location.search).get('ref')
  global.ref = `${ref?.toString()}`

  const start = () => {
    if (global.wall === 0) {
      return
    }
    if (global.energy < 10) {
      alert('Your energy is less than 10. Please charge energy')
      return
    }
    store.dispatch(setGameStatus(1))
    onStart()
  }
  // const connectWallet = () => {}
  const normalAttack = () => {
    if (!connected) {
      return
    }
    onAttack(1)
  }
  const secondAttack = () => {
    if (!connected) {
      return
    }
    onAttack(2)
  }
  const thirdAttack = () => {
    if (!connected) {
      return
    }
    onAttack(3)
  }
  const inventory = () => {
    if (global.wall === 0) {
      return
    }
    onInventory()
  }

  // const dragon = () => {
  //   if (global.wall === 0) {
  //     return
  //   }
  //   onDragon()
  // }
  const dispatch = useDispatch<any>()
  const navigate = useNavigate();
  // const [openAccount, setOpenAccount] = useState(showAccount)
  const [show, setShow] = useState(false)
  const handleOpenAccount = (flag: boolean) => {
    setShowAccount(false)
  }
  const { connected, chainID, address, connect } = useWeb3Context()
  const [dragonModalOpen, setDragonModalOpen] = useState(false);

  useEffect(() => {
    if (connected && address !== '') {
      setShow(true)
      dispatch(
        getUserData(address, ref, (res: any) => {
          if (!res.success) {
            dispatch(onShowAlert(res.message, 'info'))
          }
        }),
      )
    } else {
    }
  }, [chainID, connected, address])

  useEffect(() => {
    setTimeout(() => {
      store.dispatch(setLoadingStatus(false));
    }, 2000)
  }, [location.key])
  const onLand = () => {
    store.dispatch(setLoadingStatus(true));
    navigate("/land", { replace: true });
  }

  return (
    <div className="relative w-full">
      {isLoading === true ?
        <div>
          Loading
        </div>
        :
        <div className="grid h-full" style={{minWidth: '1600px'}}>
          <div className="flex h-full flex-1 flex-col p-8 min-w-[1024px]">
            <InforModal
              openAccount={showAccount}
              setOpenAccount={handleOpenAccount}
            />

            {gameState === 0 && (
              <div className="flex flex-col justify-center flex-1 h-full d-flex">

                {!inventoryOpened && !dragonOpened && (
                  <div>
                    <div className="btn-group">
                      {/* <div className="btn-wrapper">
                      <ButtonComponent onClick={start}>
                        <img src="assets/images/play pve.png"/>
                      </ButtonComponent>
                    </div>
                    <div className="btn-wrapper">
                      <ButtonComponent>
                        <img src="assets/images/play pvp.png"/>
                      </ButtonComponent>
                    </div>
                    <div className="btn-wrapper">
                      <ButtonComponent onClick={inventory}>
                        <img src="assets/images/inventory.png"/>
                      </ButtonComponent>
                    </div> */}
                    </div>
                    <div className="btn-ligroup">
                      <ButtonComponent onClick={() => !address ? null : setDragonModalOpen(true)}>
                        <img
                          src="assets/images/characters.png"
                        />
                      </ButtonComponent>
                      {/* <Link to="/land" className="button muted-button"> */}
                      <ButtonComponent onClick={() => !address ? null : onLand()}>
                        <img
                          src="assets/images/land.png"
                        />
                      </ButtonComponent>
                      {/* </Link> */}
                    </div>
                  </div>
                )}
              </div>
            )}
            {gameState === 1 && global.currentDragonName === 'siren-1' && (
              <>
                <GameHeaderComponent />
                {!turn && atkBtnState && (
                  <div className="absolute bottom-0 right-0 gap-2 p-4">
                    {/* <AttackButton /> */}
                    <button
                      onClick={() => {
                        if (thirdTurn === 0) {
                          thirdAttack()
                        }
                      }}
                      style={{
                        position: 'absolute',
                        right: '200px',
                        bottom: '50px',
                      }}
                    >

                      <div className="w-[160px]">
                        {thirdTurn === 0 && (
                          <img src="assets/images/btn_attack_2.png" />
                        )}
                        {thirdTurn !== 0 && (
                          <img src="assets/images/btn_attack_2_d.png" />
                        )}
                        {thirdTurn !== 0 && (
                          <h1
                            style={{
                              position: 'absolute',
                              fontSize: '60px',
                              fontFamily: 'Anime Ace',
                              color: '#ffffff',
                              left: '30px',
                              top: '30px',
                            }}
                          >{`${5 - thirdTurn}T`}</h1>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        if (secondTurn === 0) {
                          secondAttack()
                        }
                      }}
                      style={{
                        position: 'absolute',
                        right: '90px',
                        bottom: '210px',
                      }}
                    >
                      <div className="w-[160px]">
                        {secondTurn === 0 && (
                          <img src="assets/images/btn_attack_3.png" />
                        )}
                        {secondTurn !== 0 && (
                          <img src="assets/images/btn_attack_3_d.png" />
                        )}
                        {secondTurn !== 0 && (
                          <h1
                            style={{
                              position: 'absolute',
                              fontSize: '60px',
                              fontFamily: 'Anime Ace',
                              color: '#ffffff',
                              left: '30px',
                              top: '30px',
                            }}
                          >{`${4 - secondTurn}T`}</h1>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={normalAttack}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '50px',
                      }}
                    >
                      <div className="w-[129px]">
                        <img src="assets/images/btn_attack.png" />
                      </div>
                    </button>

                  </div>
                )}
              </>
            )}
            {gameState === 1 && global.currentDragonName === 'siren-4' && (
              <>
                <GameHeaderComponent />
                {!turn && atkBtnState && (
                  <div className="absolute bottom-0 right-0 gap-2 p-4">
                    {/* <AttackButton /> */}

                    <button
                      onClick={normalAttack}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '50px',
                      }}
                    >
                      <div className="w-[129px]">
                        <img src="assets/images/btn_attack.png" />
                      </div>
                    </button>

                  </div>
                )}
              </>
            )}
          </div>
        </div>
      }
      <DragonModal
        dragonModalOpen={dragonModalOpen}
        setDragonModalOpen={setDragonModalOpen}
      />
    </div>
  )
}
