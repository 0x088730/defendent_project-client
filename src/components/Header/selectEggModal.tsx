import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import "./modal.css"
import { useState, useEffect } from 'react'

interface Props {
    eggModalOpen: any
    setEggModalOpen: any
    cooldownCount: any
    setCooldownCount: any
    egg: any
}

const SelectEggModal = ({
    eggModalOpen,
    setEggModalOpen,
    cooldownCount,
    setCooldownCount,
    egg,
}: Props) => {
    const [eggNum, setEggNum] = useState('');

    useEffect(() => {
        setEggNum(cooldownCount);
    }, [eggModalOpen])
    const onChangeEggNum = (value: any) => {
        let num = value / 1;
        if(Number.isNaN(num)) {
            alert("Input Number")
            setEggNum("0");
            return
        }
        if(value > 10) {
            alert("Max: 10 Eggs")
            setEggNum("0");
            return
        }
        if(value > egg) {
            alert("Not Enough Eggs")
            setEggNum(egg);
            return
        }
        setEggNum(value);
    }
    const onBtnClick = () => {
        setCooldownCount(eggNum);
        setEggModalOpen(false);
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
                open={eggModalOpen}
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
                            width: '15%',
                            transform: 'translate(26%, -27%)',
                            cursor: 'pointer',
                            zIndex: 5,
                        }}
                        onClick={() => setEggModalOpen(false)}
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
                                <p>Number of Eggs</p>
                            </div>
                        </Box>
                        <TextField
                            sx={{
                                mr: 1,
                                textAlign: 'right',
                                borderColor: 'white',
                                width: '60%',
                                marginTop: '10%',
                                borderRadius: '5px',
                                backgroundColor: 'white'
                            }}
                            name="eggNum"
                            value={eggNum}
                            size='small'
                            onChange={(e) => onChangeEggNum(e.target.value)}
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
                                    marginTop: "20px",
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
            </Modal>
        </>
    )
}

export default SelectEggModal
