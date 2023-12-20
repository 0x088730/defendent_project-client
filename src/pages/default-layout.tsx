import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RingLoader } from 'react-spinners';

import './default-layout.css'
import styles from './Main/Main.module.scss'
import { HeaderComponent } from '../components'
interface AppProps {
  onModalShow: Function
  component: any
}

export const DefaultLayout: React.FC<AppProps> = (props) => {
  const gameState = useSelector((state: any) => state.app.game.gameState)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)

  useEffect(() => {
    if(isLoading === true) document.body.style.backgroundImage = 'url(assets/background/loading.png)'
    if(isLoading === false) document.body.style.backgroundImage = 'url(assets/background/background.png)'
  }, [isLoading])
  return (
    <div className="h-full">
      {isLoading === true ?
        <div className={styles.loader}>
          Loading
        </div>
        :
        <>
          <div>{gameState === 0 && <HeaderComponent onModalShow={props.onModalShow} />}</div>
          <div className="grid h-full">{props.component}</div>
        </>
      }
    </div>
  )
}
