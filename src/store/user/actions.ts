import { global } from '../../common/global'
import api from '../../utils/callApi'
import { fetchData } from '../../utils/fetchData'

import {
  GET_RESOURCES_SUCCESS,
  RESOURCE_CHANGE_SUCCESS,
  GET_WITHDRAW_AMOUNT,
  BUY_LEVEL_SUCCESS,
  CHECK_COOLDOWN_SUCCESS,
  SET_COOLDOWN_SUCCESS,
  CLAIM_SIREN_SUCCESS,
  CHECK_UPGRADE_AVAILABLE,
  HUNTER_UPGRADE_START_SUCCESS,
  CLAIM_HUNTER_SUCCESS,
  LEVELUP_HUNTER_SUCCESS,
} from './action-types'
// import { SWAP_MEATS_SUCCESS, SWAP_EGGS_SUCCESS } from "./action-types";
// import { STAKE_DIAMOND_SUCCESS, STAKE_BIRD_SUCCESS } from "./action-types";
// import { CLAIM_DIAMOND_SUCCESS, CLAIM_BIRD_SUCCESS } from "./action-types";

var is_diamond_staking = false
var is_diamond_claiming = false
var is_bird_staking = false
var is_bird_claiming = false

export function getUserData(address: any, ref: any, cb: any) {
  return async (dispatch: any) => {
    const data = {
      walletAddress: address,
      ref: ref,
    }
    const res = await fetchData("/user", "POST", data)
    cb(res)
    dispatch({
      type: GET_RESOURCES_SUCCESS,
      payload: { data: res },
    })
  }
}

export function startMineTownCooldown(address: any, cooldownCount: number, rewardAmount: number, cardImg: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/start/mineTown-cooldown`, 'POST', {
      walletAddress: address,
      cooldownCount: cooldownCount,
      rewardAmount: rewardAmount,
      cardImg: cardImg,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function startDragonTownCooldown(address: any, price: any, times: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/start/dragonTown-cooldown`, 'POST', {
      walletAddress: address,
      price: price,
      times: times,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function stakeDiamond(address: any, index: number, item: number, cb: any,) {
  return async (dispatch: any) => {
    try {
      if (is_diamond_staking) return
      is_diamond_staking = true
      const res = await fetchData(`/user/stake/diamond`, 'POST', {
        walletAddress: address,
        position: index,
        diamond: item,
      })

      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
      is_diamond_staking = false
    } catch (e) {
      is_diamond_staking = false
    }
  }
}

export function stakeBird(address: any, position: number, cb: any) {
  return async (dispatch: any) => {
    try {
      if (is_bird_staking) return
      is_bird_staking = true
      const res = await fetchData(`/user/stake/bird`, 'POST', {
        walletAddress: address,
        position,
      })
      is_bird_staking = false

      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    } catch (e) {
      is_bird_staking = false
    }
  }
}

export function swapMeats(address: any, level: Number, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/swap/meat`, 'POST', {
      walletAddress: address,
      level: level,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function changeResources(address: any, drgAmount: Number, meatAmount: Number, eggAmount: Number, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/change/resources`, 'POST', {
      walletAddress: address,
      drgAmount: drgAmount,
      meatAmount: meatAmount,
      eggAmount: eggAmount,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function buyLevel(address: any, dragon: any, meatAmount: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/buy/level`, 'POST', {
      walletAddress: address,
      dragon: dragon,
      meatAmount: meatAmount,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function checkCooldown(address: any, type: string, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/check/cooldown`, 'POST', {
      walletAddress: address,
      type: type,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function getMiningStatus(address: any, cb: any) {
  return async (dispatch: any) => {

    const res = await fetchData(`/user/getMiningStatus`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function levelupHunter(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/levelup/hunter`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function checkUpgradeAvailable(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/check/upgradeavailable`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function claimDrg(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/claim/drg`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function convertDrg(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/convert/drg`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function claimHunter(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/claim/hunter`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: CLAIM_HUNTER_SUCCESS,
      payload: { data: res },
    })
  }
}
export function claimDragonTown(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/claim/dragonTown`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: CLAIM_HUNTER_SUCCESS,
      payload: { data: res },
    })
  }
}
export function setCooldown(address: any, type: string, value: boolean, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/set/cooldown`, 'POST', {
      walletAddress: address,
      type: type,
      value: value
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function swapEggs(address: any, amount: Number, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/swap/egg`, 'POST', {
      walletAddress: address,
      amount: amount,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function upgradeWall(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/upgrade/wall`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function claimDiamond(address: any, index: number, cb: any) {
  return async (dispatch: any) => {
    try {
      if (is_diamond_claiming) return
      is_diamond_claiming = true
      const res = await fetchData(`/user/claim/diamond`, 'POST', {
        walletAddress: address,
        position: index,
      })
      is_diamond_claiming = false
      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    } catch (e) {
      is_diamond_claiming = false
    }
  }
}

export function claimBird(address: any, position: number, cb: any) {
  return async (dispatch: any) => {
    try {
      if (is_bird_claiming) return
      is_bird_claiming = true
      const res = await fetchData(`/user/claim/bird`, 'POST', {
        walletAddress: address,
        position,
      })
      is_bird_claiming = false
      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    } catch (e) {
      is_bird_claiming = false
    }
  }
}

export function depositRequest(
  address: any,
  amount: number,
  txID: string,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/deposit`, 'POST', {
      walletAddress: address,
      amount: amount,
      txID: txID,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function meatRequest(
  address: any,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/meat`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function withdrawRequest(
  address: any,
  amount: number,
  // txID: string,
  cb: any,
) {
  return async (dispatch: any) => {
    let res
    try {
      res = await fetchData(`/user/withdraw`, 'POST', {
        walletAddress: address,
        amount: amount,
        // txID: txID,
      })
    } catch (e) {
      cb({ success: false, message: 'maximum withdraw amount exceed' })
    }

    cb(res)
    if (res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    }
  }
}
export function buyDragon(
  address: any,
  dragon: any,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/buy/dragon`, 'POST', {
      walletAddress: address,
      dragon: dragon,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function buyPremium(
  address: any,
  amount: number,
  txID: string,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/buypremium`, 'POST', {
      walletAddress: address,
      amount: amount,
      txID: txID,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function buyMap(
  address: any,
  amount: number,
  txID: string,
  position: number,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/buymap`, 'POST', {
      walletAddress: address,
      amount: amount,
      txID: txID,
      position: position,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function buyMining(
  address: any,
  amount: number,
  txID: string,
  type: string,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/buymining`, 'POST', {
      walletAddress: address,
      amount: amount,
      txID: txID,
      type: type,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function claimMining(address: any, type: string, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/claimmining`, 'POST', {
      walletAddress: address,
      type: type,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function requestMining(address: any, type: string, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/requestmining`, 'POST', {
      walletAddress: address,
      type: type,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function saveDiscord(address: any, discord: string, cb: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/discord`, 'POST', {
      walletAddress: address,
      discord: discord,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function plantAllMeat(address: any, cb?: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/plant/set`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    if (res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    }
  }
}
export function getAllMeat(address: any, cb?: any) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/plant/get`, 'POST', {
      walletAddress: address,
    })
    cb(res)
    if (res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    }
  }
}

export async function checkWithdrawableReqeust(
  address: string,
  amount: number,
) {
  return await fetchData(`/user/check-withdrawable`, 'POST', {
    walletAddress: address,
    amount: amount,
  })
}

export async function getWithdrawAmount(address: string) {
  return async (dispatch: any) => {
    const res = await fetchData(`/user/get-withdrew-amount`, `POST`, {
      walletAddress: address,
    })
    if (res.success) {
      dispatch({
        type: GET_WITHDRAW_AMOUNT,
        payload: res,
      })
    }
  }
}

// export function addExp(address: any, amount: Number, cb: any) {
//   return async (dispatch: any) => {
//     const res = await fetchData(`/user/add/exp`, 'POST', {
//       walletAddress: address,
//       amount: amount,
//     })
//     cb(res)
//     dispatch({
//       type: RESOURCE_CHANGE_SUCCESS,
//       payload: { data: res },
//     })
//   }
// }

