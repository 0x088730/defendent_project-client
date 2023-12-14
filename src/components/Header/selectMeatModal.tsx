import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import "./modal.css"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { buyLevel } from '../../store/user/actions'
import { global } from '../../common/global'
import { getProfile } from '../../common/api'

interface Props {
    meatModalOpen: any
    setMeatModalOpen: any
    dragonInfo: any
    setDragonInfo: any
    meat: any
    setMeat: any
}

const SelectMeatModal = ({
    meatModalOpen,
    setMeatModalOpen,
    dragonInfo,
    setDragonInfo,
    meat,
    setMeat,
}: Props) => {
    const dispatch = useDispatch<any>()
    const [meatNum, setMeatNum] = useState(0);

    useEffect(() => {
        setMeatNum(meat);
    }, [meatModalOpen])
    const onChangeMeatNum = (value: any) => {
        let num = value / 1;
        if (Number.isNaN(num)) {
            alert("Input Number")
            setMeatNum(0);
            return
        }
        if (value > 10) {
            alert("Max: 10 Meats")
            setMeatNum(0);
            return
        }
        if (value > meat) {
            alert("Not Enough Meats")
            setMeatNum(meat);
            return
        }
        setMeatNum(value);
    }
    const onBtnClick = () => {
        if (global.walletAddress !== '') {
            dispatch(
                buyLevel(global.walletAddress, dragonInfo.dragonName, meatNum, (res: any) => {
                    setDragonInfo(res.data.dragons);
                    setMeat(res.data.meat);
                    getProfile(global.walletAddress, "dragon")
                })
            )
            setMeatModalOpen(false);
        }
    }

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
            xs: 130,
            md: 350,
        },
    }

    return (
        <>
            <Modal
                open={meatModalOpen}
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
                            width: '10%',
                            transform: 'translate(26%, -27%)',
                            cursor: 'pointer',
                            zIndex: 5,
                        }}
                        onClick={() => setMeatModalOpen(false)}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            textAlign: "center"
                        }}
                    >
                        <Box>
                            <div
                                style={{
                                    fontFamily: 'CubicPixel',
                                    fontWeight: 'bold',
                                    fontSize: '30px',
                                    textAlign: 'center',
                                    marginTop: '10%',
                                    color: '#e7e1e1',
                                    lineHeight: '100%',
                                }}
                            >
                                <p>Number of Meats</p>
                            </div>
                        </Box>
                        <p
                            style={{
                                color: 'white',
                                fontSize: '17px',
                                fontFamily: 'CubicPixel',
                                fontWeight: 'bold',
                                letterSpacing: '2px',
                                textShadow: '2px 2px black',
                                marginTop: '5%',
                                marginLeft: '70px',
                            }}
                        >You have <span style={{ color: '#ff8a00' }}>{meat}</span>meat</p>
                        <TextField
                            sx={{
                                mr: 1,
                                textAlign: 'right',
                                borderColor: 'white',
                                width: '60%',
                                borderRadius: '5px',
                                backgroundColor: 'white'
                            }}
                            name="meatNum"
                            placeholder={`${meatNum}`}
                            size='small'
                            onChange={(e) => onChangeMeatNum(e.target.value)}
                        />
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                width: '100%',
                                margin: 0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                onClick={() => onBtnClick()}
                                sx={{
                                    width: '180px',
                                    height: '60px',
                                    marginTop: "15px",
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
                                    SELECT
                                </p>
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Modal >
        </>
    )
}

export default SelectMeatModal
