import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { global } from '../../common/global'
import "./modal.css"
import { buyDragon } from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { getProfile } from '../../common/api'
import DragonInfoModal from './DragonInfoModal'

interface Props {
    dragonModalOpen: any
    setDragonModalOpen: any
}

const DragonModal = ({
    dragonModalOpen,
    setDragonModalOpen,
}: Props) => {
    const dispatch = useDispatch<any>()
    const userModule = useSelector((state: any) => state.userModule)
    const { address } = useWeb3Context();

    const [meat, setMeat] = useState(userModule.user.meat);
    useEffect(() => {
        if (global.dragons.length === 1) {
            setBuyedGoldDragon(false);
            setBuyedPinkDragon(false);
            setBuyedDarkDragon(false);
        }
        if (global.dragons.length === 2) {
            setBuyedGoldDragon(true);
            setBuyedPinkDragon(false);
            setBuyedDarkDragon(false);
        }
        if (global.dragons.length === 3) {
            setBuyedGoldDragon(true);
            setBuyedPinkDragon(true);
            setBuyedDarkDragon(false);
        }
        if (global.dragons.length === 4) {
            setBuyedGoldDragon(true);
            setBuyedPinkDragon(true);
            setBuyedDarkDragon(true);
        }
    }, [dragonModalOpen])
    useEffect(() => {
        if (address) {
            getProfile(address, "dragon").then(() => {
                setMeat(userModule.user.meat);
            })
        }
    }, [address, userModule.user.meat])

    const [buyedGoldDragon, setBuyedGoldDragon] = useState(false);
    const [buyedPinkDragon, setBuyedPinkDragon] = useState(false);
    const [buyedDarkDragon, setBuyedDarkDragon] = useState(false);

    const [dragonInfoModalOpen, setDragonInfoModalOpen] = useState(false);
    const [dragonInfo, setDragonInfo] = useState({});
    const [buyingStatus, setBuyingStatus] = useState(false);

    const onBuyDragon = (name: any, num: any) => {
        if (buyingStatus === true) return
        setBuyingStatus(true);
        if (address !== '') {
            dispatch(
                buyDragon(address, { dragonName: name, dragonNo: num }, (res: any) => {
                    if (res.data.name === name) {
                        if (name === "gold_dragon") setBuyedGoldDragon(true);
                        if (name === 'pink_dragon') setBuyedPinkDragon(true);
                        if (name === 'dark_dragon') setBuyedDarkDragon(true)
                        getProfile(address, "dragon");
                        setBuyingStatus(false);
                    }
                }),
            )
        }
    }
    const selectDragon = (num: any) => {
        if (global.dragons.length > num) {
            setDragonInfo(global.dragons[num]);
            setDragonInfoModalOpen(true);
            setDragonModalOpen(false);

        }
    }
    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
            xs: 130,
            md: 900,
        },
    }

    return (
        <>
            <Modal
                open={dragonModalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <img alt="" src="/images/modal_bg.png" />

                    <img
                        alt=""
                        src="/images/support/support_md_close_btn.png"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '7%',
                            transform: 'translate(26%, -27%)',
                            cursor: 'pointer',
                            zIndex: 5,
                        }}
                        onClick={() => setDragonModalOpen(false)}
                    />
                    <Box
                        className='displayCenter'
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            padding: "20px",
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: buyedGoldDragon === true ? '89px' : '119px',
                            left: '90px',
                            textAlign: 'center'
                        }}>
                            {buyedGoldDragon === true ?
                                <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[1] !== undefined ? global.dragons[1].level : "1"}`}</span></div>
                                : null
                            }
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => buyedGoldDragon === false ? null : selectDragon(1)}
                            >
                                <img src="/assets/images/dragons/gold_dragon.gif" width="170px" height="170px" style={{ marginLeft: '28px' }} />
                            </div>
                            {
                                buyedGoldDragon === false ?
                                    <div>
                                        <Button
                                            onClick={() => onBuyDragon("gold_dragon", 0)}
                                            sx={{
                                                width: '145px',
                                                height: '60px',
                                                marginTop: "-9px",
                                            }}
                                        >
                                            <img alt="" src="/assets/images/big-button.png" />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '20px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px"
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                textAlign: 'left',
                                                marginLeft: '50px'
                                            }}
                                        >
                                            common-70% <br />
                                            rare-20% <br />
                                            legendery-18%
                                        </div>
                                    </div>
                                    :
                                    <Button
                                        sx={{
                                            width: '145px',
                                            height: '60px',
                                            // marginTop: "20px"
                                            marginTop: "-9px",
                                        }}
                                    >
                                        <img alt="" src="/assets/images/big-button.png" />
                                        <p
                                            style={{
                                                position: 'absolute',
                                                fontFamily: 'CubicPixel',
                                                fontSize: '20px',
                                                textAlign: 'center',
                                                color: '#e7e1e1',
                                                letterSpacing: "2px"
                                            }}
                                        >
                                            Common
                                        </p>
                                    </Button>
                            }
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: buyedPinkDragon === true ? '89px' : '119px',
                            left: '325px',
                            textAlign: 'center'
                        }}>
                            {buyedPinkDragon === true ?
                                <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[2] !== undefined ? global.dragons[2].level : "1"}`}</span></div>
                                : null
                            }
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => buyedGoldDragon === false ? null : selectDragon(2)}
                            >
                                <img src="/assets/images/dragons/pink_dragon.gif" width="232px" height="232px" />
                            </div>
                            {
                                buyedPinkDragon === false ?
                                    <div>
                                        {buyedGoldDragon === false ?
                                            <Button
                                                sx={{
                                                    width: '145px',
                                                    height: '60px',
                                                    marginLeft: '-15px'
                                                }}
                                                disabled
                                            >
                                                <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                                                <p
                                                    style={{
                                                        position: 'absolute',
                                                        fontFamily: 'CubicPixel',
                                                        fontSize: '20px',
                                                        textAlign: 'center',
                                                        color: '#e7e1e1',
                                                        letterSpacing: "2px",
                                                        opacity: '0.8'
                                                    }}
                                                >
                                                    BUY
                                                </p>
                                            </Button>
                                            :
                                            <Button
                                                onClick={() => onBuyDragon("pink_dragon", 1)}
                                                sx={{
                                                    width: '145px',
                                                    height: '60px',
                                                    marginLeft: '-15px'
                                                }}
                                            >
                                                <img alt="" src="/assets/images/big-button.png" />
                                                <p
                                                    style={{
                                                        position: 'absolute',
                                                        fontFamily: 'CubicPixel',
                                                        fontSize: '20px',
                                                        textAlign: 'center',
                                                        color: '#e7e1e1',
                                                        letterSpacing: "2px"
                                                    }}
                                                >
                                                    BUY
                                                </p>
                                            </Button>
                                        }

                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                textAlign: 'left',
                                                marginLeft: '62px'
                                            }}
                                        >
                                            common-50% <br />
                                            rare-30% <br />
                                            legendery-20%
                                        </div>
                                    </div>
                                    :
                                    <Button
                                        sx={{
                                            width: '145px',
                                            height: '60px',
                                            marginLeft: '-15px',
                                            // marginTop: '20px'
                                        }}
                                    >
                                        <img alt="" src="/assets/images/big-button.png" />
                                        <p
                                            style={{
                                                position: 'absolute',
                                                fontFamily: 'CubicPixel',
                                                fontSize: '20px',
                                                textAlign: 'center',
                                                color: '#e7e1e1',
                                                letterSpacing: "2px"
                                            }}
                                        >
                                            Rare
                                        </p>
                                    </Button>
                            }
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: buyedDarkDragon === true ? '89px' : '116px',
                            right: '69px',
                            textAlign: 'center'
                        }}>
                            {buyedDarkDragon === true ?
                                <div className='levelTitle' style={{ marginLeft: "-60px" }}>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[3] !== undefined ? global.dragons[3].level : "1"}`}</span></div>
                                : null
                            }
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => buyedGoldDragon === false ? null : selectDragon(3)}
                            >
                                <img src="/assets/images/dragons/dark_dragon.gif" width="240px" height="240px" />
                            </div>
                            {
                                buyedDarkDragon === false ?
                                    <div>
                                        {buyedPinkDragon === false ?
                                            <Button
                                                sx={{
                                                    width: '145px',
                                                    height: '60px',
                                                    marginRight: '65px'
                                                }}
                                                disabled
                                            >
                                                <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                                                <p
                                                    style={{
                                                        position: 'absolute',
                                                        fontFamily: 'CubicPixel',
                                                        fontSize: '20px',
                                                        textAlign: 'center',
                                                        color: '#e7e1e1',
                                                        letterSpacing: "2px",
                                                        opacity: '0.8'
                                                    }}
                                                >
                                                    BUY
                                                </p>
                                            </Button>
                                            :
                                            <Button
                                                onClick={() => onBuyDragon("dark_dragon", 1)}
                                                sx={{
                                                    width: '145px',
                                                    height: '60px',
                                                    marginRight: '65px'
                                                }}
                                            >
                                                <img alt="" src="/assets/images/big-button.png" />
                                                <p
                                                    style={{
                                                        position: 'absolute',
                                                        fontFamily: 'CubicPixel',
                                                        fontSize: '20px',
                                                        textAlign: 'center',
                                                        color: '#e7e1e1',
                                                        letterSpacing: "2px"
                                                    }}
                                                >
                                                    BUY
                                                </p>
                                            </Button>
                                        }

                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                textAlign: 'left',
                                                marginLeft: '40px'
                                            }}
                                        >
                                            common-20% <br />
                                            rare-50% <br />
                                            legendery-30%
                                        </div>
                                    </div>
                                    :
                                    <Button
                                        sx={{
                                            width: '145px',
                                            height: '60px',
                                            marginRight: '65px',
                                            // marginTop: '20px'
                                        }}
                                    >
                                        <img alt="" src="/assets/images/big-button.png" />
                                        <p
                                            style={{
                                                position: 'absolute',
                                                fontFamily: 'CubicPixel',
                                                fontSize: '20px',
                                                textAlign: 'center',
                                                color: '#e7e1e1',
                                                letterSpacing: "2px"
                                            }}
                                        >
                                            Lengend
                                        </p>
                                    </Button>
                            }
                        </div>
                        {/* <div>
                            <img src="/assets/images/dragons/dark_dragon.png" width="200px" height="200px" />
                        </div> */}
                        {/* <div
                            style={{
                                width: '200px', height: '200px',
                                margin: '0 10px',
                                backgroundImage: `url('/assets/images/dragons/gold_dragon.png')`,
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => buyedGoldDragon === false ? null : selectDragon(1)}
                        >
                            <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                                {
                                    buyedGoldDragon === false ?
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            common-70% <br />
                                            rare-20% <br />
                                            legendery-18%
                                        </div>
                                        :
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                color: 'white',
                                                textShadow: "2px 2px 5px wheat",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            COMMON
                                        </div>
                                }
                            </div>
                            {
                                buyedGoldDragon === false ?
                                    <Button
                                        onClick={() => onBuyDragon("gold_dragon", 0)}
                                        sx={{
                                            width: '180px',
                                            height: '60px',
                                            marginTop: "20px",
                                            position: 'relative',
                                            top: '50px',
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
                                            BUY
                                        </p>
                                    </Button>
                                    :
                                    <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[1] !== undefined ? global.dragons[1].level : "1"}`}</span></div>
                            }
                        </div>
                        <div
                            style={{
                                width: '200px', height: '200px',
                                margin: '0 10px',
                                backgroundImage: `url('/assets/images/dragons/pink_dragon.png')`,
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => buyedPinkDragon === false ? null : selectDragon(2)}
                        >
                            <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                                {
                                    buyedPinkDragon === false ?
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            common-50% <br />
                                            rare-30% <br />
                                            legendery-20%
                                        </div>
                                        :
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                color: 'white',
                                                textShadow: "2px 2px 5px wheat",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            RARE
                                        </div>
                                }
                            </div>
                            {
                                buyedPinkDragon === false ?
                                    buyedGoldDragon === false ?
                                        <Button
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
                                            }}
                                            disabled
                                        >
                                            <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '28px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px",
                                                    opacity: '0.8'
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => onBuyDragon("pink_dragon", 1)}
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
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
                                                BUY
                                            </p>
                                        </Button>
                                    :
                                    <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[2] !== undefined ? global.dragons[2].level : "1"}`}</span></div>
                            }
                        </div>
                        <div
                            style={{
                                width: '200px', height: '200px',
                                margin: '0 10px',
                                backgroundImage: `url('/assets/images/dragons/dark_dragon.png')`,
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => buyedDarkDragon === false ? null : selectDragon(3)}
                        >
                            <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                                {
                                    buyedDarkDragon === false ?
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            common-20% <br />
                                            rare-50% <br />
                                            legendery-30%
                                        </div>
                                        :
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                color: 'white',
                                                textShadow: "2px 2px 5px wheat",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            LEGENDERY
                                        </div>
                                }
                            </div>
                            {
                                buyedDarkDragon === false ?
                                    buyedPinkDragon === false ?
                                        <Button
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
                                            }}
                                            disabled
                                        >
                                            <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '28px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px",
                                                    opacity: '0.8'
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => onBuyDragon("dark_dragon", 2)}
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
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
                                                BUY
                                            </p>
                                        </Button>
                                    :
                                    <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[3] !== undefined ? global.dragons[3].level : "1"}`}</span></div>
                            }
                        </div> */}
                    </Box>
                </Box>
            </Modal>
            <DragonInfoModal
                setDragonModalOpen={setDragonModalOpen}
                dragonInfoModalOpen={dragonInfoModalOpen}
                setDragonInfoModalOpen={setDragonInfoModalOpen}
                dragonInfo={dragonInfo}
                setDragonInfo={setDragonInfo}
                meat={meat}
                setMeat={setMeat}
            />
        </>
    )
}

export default DragonModal
