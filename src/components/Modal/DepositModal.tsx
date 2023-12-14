import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, TextField, Stack, InputLabel, FormControl /* , Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
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
  /* checkWithdrawableReqeust,  */ depositRequest,
  meatRequest,
  withdrawRequest,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
// import { Withdraw } from "../../store/user/action-types";
// import api from '../../utils/callApi';
import { getBcsPrice, getWithdrewDrgAmount } from '../../utils/user'

interface Props {
  depositModalOpen: boolean
  setDepositModalOpen: any
  modalTitle: any
  // meat: any
  // egg: any
  // onExchange: any
  // onExchangeEgg: any
}

const DepositModal = ({
  depositModalOpen,
  setDepositModalOpen,
  modalTitle,
  // meat,
  // egg,
  // onExchange,
  // onExchangeEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  // const handleOpen = () => setOpen(true)
  // const handleClose = () => setOpen(false)

  const [deposit_Withdraw, setdeposit_Withdraw] = useState("DEPOSIT")
  const [bcsAmount, setBCSAmount] = useState(0)
  const [drgAmount, setDrgAmount] = useState(0)
  const [withdrawableBcsAmount, setWithdrawableBcsAmount] = useState<number>(0)

  useEffect(() => {
    ; (async () => {
      const withdrewDrgAmount = getWithdrewDrgAmount(user.withdraws) // Drg
      const bcsPrice = 1
      const maxAmount =
        (checkPremium(user.premium).isPremium ? 10 : 5) / bcsPrice
    
      setWithdrawableBcsAmount(maxAmount - Math.floor(withdrewDrgAmount / 10))
    })()
  }, [user.withdraws])


  const onChangeAmount = (e: any) => {
    e.preventDefault()

    if (e.target.value < 0) {
      if(modalTitle === "deposit"){
        setBCSAmount(320)
      }
      else {
        setDrgAmount(5)
      }
      return
    }
    if(modalTitle === "deposit"){
      setBCSAmount(e.target.value);
    }
    else {
      setDrgAmount(e.target.value)
    }
  }

  const onChangeEggAmount = (e: any) => {
    e.preventDefault()

    if (e.target.value < 0) return

    setDrgAmount(e.target.value)
  }

  const onmeat = async () => {
    dispatch(
      meatRequest(address, (res: any) => {
        // handleClose()
        if (res.success) {
          dispatch(onShowAlert('meat Load successfully', 'success'))
        } else {
          dispatch(onShowAlert('meat Load faild!', 'warning'))
        }
      }),
    )
  }

  const onDeposit = async () => {
    if (bcsAmount < 320) {
      alert("minimal withdraw amount is 320BCS");
      return
    }

    dispatch(onShowAlert('Pease wait while confirming', 'info'))
    const transaction = await deposit(
      address,
      ADMIN_WALLET_ADDRESS[chainId],
      bcsAmount,
    )
    if(transaction===null || transaction===undefined) 
    {
      return
    }
    dispatch(
      depositRequest(
        address,
        bcsAmount,
        transaction.transactionHash,
        (res: any) => {
          // handleClose()
          if (res.success) {
            dispatch(onShowAlert('Deposit successfully', 'success'))
          } else {
            dispatch(onShowAlert('Deposit faild!', 'warning'))
          }
        },
      ),
    )
  }

  const onWithdraw = async () => {
    console.log("withdraw amount", drgAmount)
    if (drgAmount > 50) {
      alert("Maxim withdraw amount is 50DRG");
      return
    }
console.log("withdrawableBcsAmount", withdrawableBcsAmount)
    if (withdrawableBcsAmount * 10 <= drgAmount) {
      dispatch(
        onShowAlert(
          `you can withdraw only ${checkPremium(user.premium) ? 10 : 5
          } per day`,
          'warning',
        ),
      )
      return
    }
    dispatch(onShowAlert('Pease wait while confirming', 'info'))

    // const transaction = await sendToken(address, FEE_WALLET_ADDRESS[chainId], 1)

    dispatch(
      withdrawRequest(
        address,
        drgAmount,
        // transaction.transactionHash,
        (res: any) => {
          // handleClose()
          if (res && res?.success) {
            dispatch(onShowAlert('Withdraw successfully', 'success'))
          } else {
            dispatch(onShowAlert(res?.message, 'warning'))
          }
        },
      ),
    )
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
        open={depositModalOpen}
        // open={true}
        // onClose={handleClose}
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
            onClick={() => setDepositModalOpen(false)}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'absolute',
              top: '40px',
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box>
              <p
                style={{
                  fontFamily: 'CubicPixel',
                  fontWeight: 'bold',
                  fontSize: '40px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: '8%',
                  color: '#e7e1e1',
                  lineHeight: '100%',
                }}
              >
                {modalTitle}
              </p>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                justifyContent: "center",

                padding: '2% 6%',
                width: '500px',
                margin: "0",
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  display: 'flex',
                  boxShadow: "0 0 15px #6a4d72",
                  alignItems: 'center',
                  fontFamily: 'CubicPixel',
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  color: '#e7e1e1',
                  lineHeight: '120%',
                  padding: '15px'
                }}
              >
                <div style={{ marginTop: '0px', textAlign: "left", width: '70%' }}>
                  <div
                    style={{
                      fontFamily: 'CubicPixel',
                      color: '#ffe86b',
                      fontSize: '22px',
                      margin: '2px 20px'
                    }}
                  >
                    {modalTitle === "deposit" ? 'BCS' : 'DRG'}
                  </div>
                  <TextField
                    sx={{ mr: 1, textAlign: 'right', borderColor: 'white', width: '100%', borderRadius: '5px', backgroundColor: 'white' }}
                    name="drg"
                    value={modalTitle === 'deposit' ? bcsAmount : drgAmount}
                    size='small'
                    onChange={onChangeAmount}
                  />
                </div>
                <p style={{ textAlign: 'center', fontSize: '22px' }}>You will receive <br /> <span>{modalTitle === 'deposit' ? bcsAmount: drgAmount}</span>{modalTitle === 'deposit' ? ' DRG' : ' BCS'}</p>
                <p
                  style={{
                    color: '#770909',
                    marginTop: '12px',
                    textAlign: 'center',
                    fontFamily: 'CubicPixel',
                    fontSize: '22px',
                    fontWeight: 'bold'
                  }}
                >
                  <ErrorOutlineIcon /> {modalTitle === 'deposit' ? 'MIN DEPOSIT 320PX' : 'AVAILABLE: 5BCS'}
                </p>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Button onClick={() => modalTitle === 'deposit' ? onDeposit() : onWithdraw()}>
                    <img alt="" src="/assets/images/big-button.png" style={{ width: '60%' }} />
                    <p
                      style={{
                        position: 'absolute',
                        fontFamily: 'CubicPixel',
                        fontSize: '25px',
                        textTransform: 'uppercase',
                        color: '#e7e1e1',
                        lineHeight: '100%',
                      }}
                    >
                      {modalTitle}
                    </p>
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default DepositModal
