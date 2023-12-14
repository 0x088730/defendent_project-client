// import { chainData } from "../../hooks/data";
// import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Box, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
// import ExchangeModal from "./ExchangeModal";
import { useDispatch, useSelector } from 'react-redux'
import {
  Link,
  /* Navigate, NavLink, */ useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  /* changeNetwork, */ getTransaction /* , sendToken */,
} from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import { /* buyPremium,  */ getUserData } from '../../store/user/actions'
// import { ADMIN_WALLET_ADDRESS, chainId, PREMIUM_COST } from "../../hook/constants";
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
import { /* formatDecimal,  */ shortAddress } from '../../utils/tools'
import AccountIcon from '../AccountIcon/AccountIcon'
import PreniumModal from '../Modal/PremiumModal'

import styles from './Header.module.scss'
import HeaderModal from './HeaderModal'
import { ClientRequest } from 'http'
import InforModal from './InforModal'
import { setLoadingStatus } from '../../common/state/game/reducer'
import store from '../../store'
import DepositModal from '../Modal/DepositModal'

interface HeaderProps {
  showAccount: any
  setShowAccount: any
  Drg: any
  eggs: any
  meat: any
}

const Header = ({ showAccount, setShowAccount, Drg, eggs, meat }: HeaderProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref')

  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)

  const [openAccount, setOpenAccount] = useState(showAccount)
  const [openPremium, setOpenPremium] = useState(false)

  const [ispremium, setIsPremium] = useState(false)
  const [leftDay, setLeftDay] = useState(0)
  const [show, setShow] = useState(false)
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const { connected, chainID, address, connect } = useWeb3Context()

  const handleOpenAccount = (flag: boolean) => {
    setOpenAccount(flag)
    setShowAccount(false)
  }

  const setOpenedAccount = () => {
    setOpenAccount(true)
  }
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
    const res = checkPremium(userModule.user.premium)
    setIsPremium(res.isPremium)
    setLeftDay(res.leftDay)
  }, [userModule.user.premium])

  const getPremium = async () => {
    setOpenPremium(true)
    // try{
    //   dispatch(onShowAlert("Pease wait while confirming", "info"));
    //   let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], PREMIUM_COST);
    //   dispatch(buyPremium(address, PREMIUM_COST, transaction.transactionHash, (res:any)=>{
    //     if(res.success) {
    //       dispatch(onShowAlert("Buy permium successfully", "success"));
    //     } else {
    //       dispatch(onShowAlert("Faild in buying premium", "warning"));
    //     }
    //   }));
    // } catch(e){
    //   console.log(e);
    // }
  }

  useEffect(() => {
    headerList()
  }, [userModule])
  const onMain = () => {
    // store.dispatch(setLoadingStatus(true));
    navigate("/", { replace: true });
  }

  const onDeposit = (title: any) => {
    setModalTitle(title);
    setDepositModalOpen(true);
  }
  const headerList = () => {
    return <Box
      className={styles.Drg}
      sx={{ display: 'flex', flexDirection: "column", alignItems: 'center' }}
    >
      {!ispremium && (
        <button
          onClick={getPremium}
          style={{
            background: 'url(/images/but_style1.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: 170,
            height: 35,
            marginRight: 10,
            fontFamily: 'CubicPixel',
            fontSize: '20px'
          }}
        >
          Premium
        </button>
      )}
      {ispremium && (
        <p
          style={{
            whiteSpace: 'nowrap',
            marginRight: '8px',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >{`${leftDay} Days`}</p>
      )}

      {show && (
        <button
          onClick={setOpenedAccount}
          style={{
            marginTop: "10px",
            background: 'url(/images/but_style1.png)',
            width: 170,
            height: 35,
            fontFamily: 'CubicPixel',
            fontSize: '20px'
          }}
          className={`px-6 py-1 font-semibold text-white shadow-sm`}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span>{shortAddress(address)}</span>
            {/* <AccountIcon address={address} size={18} /> */}
          </span>
        </button>
      )}
      <p
        className={styles.meat}
        style={{ background: 'url(/images/but_style1.png)', width: 170, height: 35, marginLeft: '8px' }}
      >
        <img
          alt=""
          style={{ width: '25px', marginRight: '10px' }}
          src="/images/res_Drg.png"
        />
        {`DRG: ${Drg}`}
      </p>
      <p
        className={styles.meat}
        style={{ background: 'url(/images/but_style1.png)', width: 170, height: 35, marginLeft: '8px' }}
      >
        <img
          alt=""
          style={{ width: '25px', marginRight: '10px' }}
          src="/images/res_res.png"
        />
        {`Meat: ${meat}`}
      </p>
      <p
        className={styles.meat}
        style={{ background: 'url(/images/but_style1.png)', width: 170, height: 35, marginLeft: '8px' }}
      >
        <img
          alt=""
          style={{ width: '20px', marginRight: '10px' }}
          src="/images/res_egg.png"
        />
        {`EGG: ${eggs}`}
      </p>
      <div
        className={styles.meat}
        style={{ 
          background: 'url(/images/but_style1.png)', 
          justifyContent: "center", 
          width: 170, 
          height: 35, 
          marginLeft: '8px', 
          cursor: 'pointer',
          zIndex: '100000' 
        }}
        onClick={() => onDeposit("deposit")}
      >
        DEPOSIT
      </div>
      <p
        className={styles.meat}
        style={{ 
          background: 'url(/images/but_style1.png)', 
          justifyContent: "center", 
          width: 170, 
          height: 35, 
          marginLeft: '8px', 
          cursor: 'pointer',
          zIndex: '100000' 
        }}
        onClick={() => onDeposit("withdraw")}
      >
        WITHDRAW
      </p>      
      <DepositModal
        depositModalOpen={depositModalOpen}
        setDepositModalOpen={setDepositModalOpen}
        modalTitle={modalTitle}
        // meat={meat}
        // egg={eggs}
        // onExchange={onExchange}
        // onExchangeEgg={onExchangeEgg}
      />
    </Box>
  }

  return (
    <header>
      <Box className={styles.contents}
        sx={{
          zIndex: 100
        }}>
        <InforModal
          openAccount={openAccount}
          setOpenAccount={handleOpenAccount}
        />
        <PreniumModal open={openPremium} setOpen={setOpenPremium} />

        {headerList()}

        <Box
          className={styles.Drg}
          sx={{ display: 'flex', position: "absolute", left: "20px", top: "93vh", alignItems: 'center', zIndex: "1000" }}
        >
          {/* <Link to="/" className="button muted-button"> */}
          <button
            style={{
              background: 'url(/images/but_style2.png)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: 116,
              height: 35,
            }}
            onClick={() => onMain()}
          >
            Back
          </button>
          {/* </Link> */}
        </Box>
      </Box>
    </header>
  )
}

export default Header
