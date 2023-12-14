import { Grid, Stack } from '@mui/material'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useWeb3Context } from '../../hooks/web3Context'
import {
    checkCooldown,
    setCooldown,
    convertDrg,
} from '../../store/user/actions'
import { convertSecToHMS } from '../../utils/tools'

interface Props {
    convertModalOpen: boolean
    setConvertModalOpen: any
    Drg: any
    setDrg: any
    eggs: any
    setEggs: any
    meat: any
    setMeat: any
}

const ConvertModal = ({
    convertModalOpen,
    setConvertModalOpen,
    Drg,
    setDrg,
    eggs,
    setEggs,
    meat,
    setMeat,
}: Props) => {

    const { address } = useWeb3Context()
    const dispatch = useDispatch<any>()

    const [needMeat, setNeedMeat] = useState(5);
    const [needEgg, setNeedEgg] = useState(1);
    const [btnStatus, setBtnStatus] = useState(false);
    const [convertTimeRemained, setConvertTimeRemained] = useState(0);
    const [convertCooldown, setConvertCooldown] = useState(false);
    const [convertBtn, setConvertBtn] = useState("Start");

    const handleBirdClose = () => {
        setConvertModalOpen(false);
    }

    useEffect(() => {
        if (meat >= needMeat && eggs >= needEgg || convertCooldown === true || convertBtn === "Claim") {
            setBtnStatus(true);
            return;
        }
        setBtnStatus(false)
    }, [convertModalOpen])
    const onConvert = () => {
        if (convertCooldown === false) {
            setConvertCooldown(true);
            if (convertBtn === "Start") {
                dispatch(
                    setCooldown(address, 'convertor', true, (res: any) => {
                        setMeat(res.data.meat);
                        setEggs(res.data.eggs);
                        setConvertTimeRemained(30);
                    })
                )
            } else if (convertBtn === "Claim") {
                dispatch(convertDrg(address, (res: any) => {
                    setDrg(res.data.drg)
                    setConvertBtn('Start')
                    setConvertCooldown(false)
                    setConvertModalOpen(false)
                }))
            }
        }
    }

    useEffect(() => {
        if (convertCooldown) {
            var convertCldInterval = setInterval(() => {
                setConvertTimeRemained((prevTime) => {
                    if (prevTime === 1) {
                        setConvertBtn('Claim')
                    }
                    if (prevTime === 0) {
                        clearInterval(convertCldInterval)
                        setConvertCooldown(false)
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        }

        return () => clearInterval(convertCldInterval)
    }, [convertCooldown])

    useEffect(() => {
        if (address !== '') {
            dispatch(
                checkCooldown(address, 'convertor', (res: any) => {
                    let cooldownSec = res.data
                    if (cooldownSec === 999999) {
                        // if(miningStatus === false) return
                        // setBtnType('Start')
                    }
                    else if (cooldownSec <= 0) {
                        setConvertTimeRemained(0);
                        setConvertBtn("Claim");
                    }
                    else {
                        setConvertTimeRemained(cooldownSec)
                        setConvertCooldown(true)
                    }
                }),
            )
        }
    }, [convertModalOpen])

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
                open={convertModalOpen}
                // open={true}
                onClose={handleBirdClose}
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
                        onClick={handleBirdClose}
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
                                <p>CONVERTER</p>
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
                                            <p style={{ textShadow: '2px 2px black' }}>50~150<br />DRG</p>
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
                            {
                                btnStatus === true ?
                                    <Button
                                        onClick={() => onConvert()}
                                        sx={{
                                            width: '200px',
                                            marginTop: "30px",

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
                                            {convertTimeRemained === 0 ? convertBtn : convertSecToHMS(convertTimeRemained)}
                                        </p>
                                    </Button>
                                    :
                                    <Button
                                        sx={{
                                            width: '200px',
                                            marginTop: "30px",
                                        }}
                                        disabled
                                    >
                                        <img alt="" src="/assets/images/big-button-disable.png" style={{ opacity: '0.7' }} />
                                        <p
                                            style={{
                                                position: 'absolute',
                                                fontFamily: 'CubicPixel',
                                                fontSize: '25px',
                                                textAlign: 'center',
                                                color: '#e7e1e1',
                                                opacity: '0.7'
                                            }}
                                        >
                                            Start
                                        </p>
                                    </Button>
                            }
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'absolute',
                                bottom: '6%',
                                width: '100%'
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'CubicPixel',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    color: '#e7e1e1',
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <p>NEED FOR START:</p>
                                <div
                                    style={{
                                        width: "70px", height: '55px',
                                        border: '1px solid black',
                                        borderRadius: '25px',
                                        backgroundColor: '#f670ec',
                                        padding: '5px',
                                        marginLeft: '10px',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <img src='assets/images/meat.png' width={"50px"} />
                                    <p style={{ position: 'absolute', top: '15px', fontSize: '25px', textShadow: '2px 2px black' }}>x{needMeat}</p>
                                </div>
                                <div
                                    style={{
                                        width: "70px", height: '55px',
                                        border: '1px solid black',
                                        borderRadius: '25px',
                                        backgroundColor: '#f670ec',
                                        padding: '5px',
                                        marginLeft: '10px',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <img src='assets/images/egg.png' width={"50px"} />
                                    <p style={{ position: 'absolute', top: '15px', fontSize: '25px', textShadow: '2px 2px black' }}>x{needEgg}</p>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </Box>
            </Modal >
        </>
    )
}

export default ConvertModal
