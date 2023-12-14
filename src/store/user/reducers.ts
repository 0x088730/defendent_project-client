import type { LoginState, ActionTypes } from './action-types'
import { GET_RESOURCES_SUCCESS, RESOURCE_CHANGE_SUCCESS } from './action-types'

const initialState: LoginState = {
  user: {
    Drg: 0,
    meat: 0,
    eggs: 0,
    premium: '0',
    opendPlace: [],
    stakedDiamond: [],
    stakedBirds: [],
    miningModule: null,
    miningRequest: 0,
    miningStatus: false,
    goldMine: null,
    goldMineRequest: 0,
    uraniumMine: null,
    uraniumMineRequest: 0,
    powerMine: null,
    powerMineRequest: 0,
    withdrawLimit: 0,
    lastWithdraw: null,
    userRef: '',
    referrals: 0,
    earned: 0,
    discord: '',    
    withdraws: [],
    wall: 0,
  },
}

export function userReducer(
  state = initialState,
  action: ActionTypes,
): LoginState {
  switch (action.type) {
    case GET_RESOURCES_SUCCESS: {
      const { data } = action.payload
      const { user } = { ...state }

      user.Drg = data.Drg ? data.Drg : user.Drg
      user.meat = data.meat ? data.meat : user.meat
      user.eggs = data.eggs ? data.eggs : user.eggs
      user.premium = data.premium ? data.premium : user.premium
      user.opendPlace = data.opendPlace ? data.opendPlace : user.opendPlace
      user.stakedDiamond = data.stakedDiamond ? data.stakedDiamond : user.stakedDiamond
      user.stakedBirds = data.stakedBirds ? data.stakedBirds : user.stakedBirds
      user.miningModule = data.miningModule ? data.miningModule : user.miningModule
      user.miningRequest = data.miningRequest ? data.miningRequest : user.miningRequest
      user.miningStatus = data.miningStatus ? data.miningStatus : user.miningStatus
      user.goldMine = data.goldMine ? data.goldMine : user.goldMine
      user.goldMineRequest = data.goldMineRequest ? data.goldMineRequest : user.goldMineRequest
      user.uraniumMine = data.uraniumMine ? data.uraniumMine : user.uraniumMine
      user.uraniumMineRequest = data.uraniumMineRequest ? data.uraniumMineRequest : user.uraniumMineRequest
      user.powerMine = data.powerMine ? data.powerMine : user.powerMine
      user.powerMineRequest = data.powerMineRequest ? data.powerMineRequest : user.powerMineRequest
      user.withdrawLimit = data.withdrawLimit ? data.withdrawLimit : user.withdrawLimit
      user.lastWithdraw = data.lastWithdraw ? data.lastWithdraw : user.lastWithdraw
      user.userRef = data.userRef ? data.userRef : user.userRef
      user.referrals = data.referrals ? data.referrals : user.referrals
      user.earned = data.earned ? data.earned : user.earned
      user.discord = data.discord ? data.discord : user.discord
      user.withdraws = data.withdraws ? data.withdraws : user.withdraws
      user.wall = data.wall ? data.wall : user.wall

      return { user }
    }

    case RESOURCE_CHANGE_SUCCESS: {
      const { data } = action.payload
      const { user } = { ...state }
      
      user.Drg = data.Drg? data.Drg : user.Drg
      user.meat = data.meat? data.meat : user.meat
      user.eggs = data.eggs? data.eggs : user.eggs
      user.premium = data.premium? data.premium : user.premium
      user.miningModule = data.miningModule? data.miningModule : user.miningModule
      user.opendPlace = data.opendPlace? data.opendPlace : user.opendPlace
      user.miningRequest = data.miningRequest? data.miningRequest : user.miningRequest
      user.miningStatus = data.miningStatus ? data.miningStatus : user.miningStatus
      user.stakedDiamond = data.stakedDiamond? data.stakedDiamond : user.stakedDiamond
      user.stakedBirds = data.stakedBirds? data.stakedBirds : user.stakedBirds
      user.goldMine = data.goldMine? data.goldMine : user.goldMine
      user.goldMineRequest = data.goldMineRequest? data.goldMineRequest : user.goldMineRequest
      user.uraniumMine = data.uraniumMine? data.uraniumMine : user.uraniumMine
      user.uraniumMineRequest = data.uraniumMineRequest? data.uraniumMineRequest : user.uraniumMineRequest
      user.powerMine = data.powerMine? data.powerMine : user.powerMine
      user.powerMineRequest = data.powerMineRequest? data.powerMineRequest : user.powerMineRequest
      user.withdrawLimit = data.withdrawLimit? data.withdrawLimit : user.withdrawLimit
      user.lastWithdraw = data.lastWithdraw? data.lastWithdraw : user.lastWithdraw
      user.userRef = data.userRef? data.userRef : user.userRef
      user.referrals = data.referrals? data.referrals : user.referrals
      user.earned = data.earned? data.earned : user.earned
      user.discord = data.discord? data.discord : user.discord
      user.withdraws = data.withdraws? data.withdraws : user.withdraws
      user.wall = data.wall? data.wall : user.wall

      return { user }
    }

    default:
      return { ...state }
  }
}
