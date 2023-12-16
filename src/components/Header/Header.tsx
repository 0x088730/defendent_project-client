import { Box, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { useWeb3Context } from '../../hooks/web3Context'
import { /* buyPremium,  */ getUserData } from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
import { /* formatDecimal,  */ shortAddress } from '../../utils/tools'
import PreniumModal from '../Modal/PremiumModal'

import styles from './Header.module.scss'
import InforModal from './InforModal'
import DepositModal from '../Modal/DepositModal'

interface HeaderProps {
  showAccount: any
  setShowAccount: any
  Drg: any
  setDrg: any
  eggs: any
  meat: any
}

const Header = ({ showAccount, setShowAccount, Drg, setDrg, eggs, meat }: HeaderProps) => {
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
  }

  useEffect(() => {
    headerList()
  }, [userModule])
  const onMain = () => {
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
        setDrg={setDrg}
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
        </Box>
      </Box>
    </header>
  )
}

export default Header
