import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { useWeb3Context } from '../../hooks/web3Context'
import {
    checkCooldown,
    startDragonTownCooldown,
    claimDragonTown,
} from '../../store/user/actions'
import { convertSecToHMS, createObject } from '../../utils/tools'
import './mainModal.css'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface Props {
    townModalOpen: boolean
    setTownModalOpen: any
    drg: any
    setDrg: any
    eggs: any
    setEggs: any
}

const DragonTownModal = ({
    townModalOpen,
    setTownModalOpen,
    drg,
    setDrg,
    eggs,
    setEggs,
}: Props) => {

    const { address } = useWeb3Context()
    const dispatch = useDispatch<any>()

    const [remainedTime, setRemainedTime] = useState(0);
    const [btnType, setBtnType] = useState("Start");
    const [selectedDrg, setSelectedDrg] = useState(10);
    const [selectedTimer, setSelectedTimer] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isCooldownStarted, setIsCooldownStarted] = useState(false);
    const [eggArray, setEggArray] = useState([{ times: 0, egg: 0 },]);
    const [presentEggs, setPresentEggs] = useState(0);

    useEffect(() => {
        let d = remainedTime % 30;
        let c = Math.floor(remainedTime / 30);
        if (isCooldownStarted === true && d === 0 && c < selectedTimer) {
            setPresentEggs(presentEggs + eggArray[selectedTimer - 1 - c].egg);
        }

        if (townModalOpen === true && presentEggs === 0) {
            if (c + 1 < selectedTimer) {
                let j = Number(selectedTimer) - Number(c);
                console.log(j, presentEggs, eggArray)
                let eggNum = 0;
                for (let i = 0; i < j - 1; i++) {
                    eggNum = eggNum + Number(eggArray[i].egg);
                }
                setPresentEggs(eggNum);
            }
        }
    }, [remainedTime])

    const onChangeDrg = (value: any) => {
        if (remainedTime > 0)
            return
        if (value > drg) {
            alert("Not Enough Drg!");
            return
        }
        setSelectedDrg(value);
    }
    const onChangeTimers = (value: any) => {
        if (remainedTime > 0)
            return
        setSelectedTimer(value);
    }
    const onStartMine = () => {
        if (remainedTime > 0)
            return
        if (btnType === 'Start') {
            dispatch(
                startDragonTownCooldown(address, selectedDrg, selectedTimer, (res: any) => {
                    setRemainedTime(30 * selectedTimer);
                    setIsCooldownStarted(true);
                    setLoading(true);
                    setDrg(res.data.drg);
                    setEggArray(res.data.eggArray);
                })
            )
        } else if (btnType === 'Claim') {
            dispatch(
                claimDragonTown(address, (res: any) => {
                    setEggs(res.data);
                    setBtnType('Start');
                    setPresentEggs(0);
                })
            )
        }
    }

    useEffect(() => {
        if (isCooldownStarted && address !== '') {
            var cooldownInterval = setInterval(() => {
                setRemainedTime((prevTime) => {
                    if (prevTime === 1) {
                        setBtnType('Claim')
                        dispatch(
                            checkCooldown(address, 'dragon-town', (res: any) => {
                                if (res.data === false) return
                                let cooldownSec = res.data.time;
                                setEggArray(res.data.eggArray);
                                setSelectedDrg(res.data.price);
                                setSelectedTimer(res.data.count);
                                if (cooldownSec === false) {
                                    setRemainedTime(-1)
                                    setIsCooldownStarted(false)

                                    setBtnType('Start')
                                } else if (cooldownSec <= 0) {
                                    setRemainedTime(-1)
                                    setIsCooldownStarted(false)
                                    setLoading(false)
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
        if (townModalOpen === true && address !== '')
            dispatch(
                checkCooldown(address, 'dragon-town', (res: any) => {
                    if (res.data === false) return
                    let cooldownSec = res.data.time;
                    setEggArray(res.data.eggArray);
                    setSelectedDrg(res.data.price);
                    setSelectedTimer(res.data.count);
                    if (cooldownSec === false) {
                        setRemainedTime(-1)
                        setIsCooldownStarted(false)
                        setBtnType('Start')
                    } else if (cooldownSec <= 0) {
                        setBtnType('Claim')
                        setRemainedTime(-1)
                        setIsCooldownStarted(false)
                        setLoading(false)
                    } else {
                        setRemainedTime(cooldownSec)
                        setIsCooldownStarted(true)
                    }
                }),
            )
    }, [townModalOpen, dispatch])

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
            xs: 150,
            md: 660,
        },
    }

    return (
        <>
            <Modal
                open={townModalOpen}
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
                        onClick={() => setTownModalOpen(false)}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Box>
                            <div
                                style={{
                                    fontFamily: 'CubicPixel',
                                    fontWeight: 'bold',
                                    fontSize: '40px',
                                    textAlign: 'center',
                                    marginTop: '23%',
                                    color: '#e7e1e1',
                                    lineHeight: '100%',
                                }}
                            >
                                <p>Dragon Town</p>
                            </div>
                        </Box>
                        <Box sx={{ minWidth: 120, width: '52%', marginTop: '2%' }}>
                            <FormControl fullWidth>
                                <p className='description'>
                                    SELECT PRICE
                                </p>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={selectedDrg}
                                    value={selectedDrg}
                                    sx={{
                                        backgroundColor: 'white',
                                        borderRadius: '3px',
                                        height: '40px',
                                    }}
                                    onChange={(e) => onChangeDrg(e.target.value)}
                                >
                                    <MenuItem value={10}>10 drg</MenuItem>
                                    <MenuItem value={20}>20 drg</MenuItem>
                                    <MenuItem value={30}>30 drg</MenuItem>
                                    <MenuItem value={40}>40 drg</MenuItem>
                                    <MenuItem value={50}>50 drg</MenuItem>
                                </Select>
                                <p className='description' style={{ fontSize: '15px', letterSpacing: 0 }}>
                                    INCREASE THE AMOUNT INCREASES THE CHANCE GET EGGS
                                </p>
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 120, width: '52%', marginTop: '2%' }}>
                            <FormControl fullWidth>
                                <p className='description'>
                                    SELECT TIMES
                                </p>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={selectedTimer}
                                    value={selectedTimer}
                                    sx={{ backgroundColor: 'white', borderRadius: '3px', height: '40px' }}
                                    onChange={(e) => onChangeTimers(e.target.value)}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '2%',
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
                                <p>CAN BE MINED:</p>&nbsp;&nbsp;
                                <div
                                    style={{
                                        width: '70px', height: '70px',
                                        backgroundImage: 'radial-gradient(farthest-corner at 20px 50px,#71923c, #ebd8c2 )',
                                        border: "3px solid black",
                                        borderRadius: '23px',
                                        padding: '5px'
                                    }}
                                >
                                    <img src='assets/images/egg.png' style={{ width: '60px', height: '50px' }} />
                                    <p style={{ position: 'relative', top: '-70px', right: '-25px', color: '#ec8412', fontSize: '25px', textShadow: '2px 2px black' }}>x{presentEggs}</p>
                                </div>
                            </div>
                            {loading === true ?
                                <CircularProgress style={{ position: 'absolute', bottom: '92px', right: '210px', color: 'black' }} size={55} />
                                : null
                            }
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                width: '200px',
                                marginTop: "5px",
                            }}
                        >
                            <Button onClick={() => onStartMine()}>
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
                                    {remainedTime <= 0 ? btnType : convertSecToHMS(remainedTime)}
                                </p>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal >
        </>
    )
}

export default DragonTownModal
