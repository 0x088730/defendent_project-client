// import { EmptyObject } from "@reduxjs/toolkit"

export interface UserProfile {
  walletAddress: string
  userRef: string
  ref: string
  referals: number
  exp: number
  rarity: number
  level: number
  purchase: [
    {
      dragon: string
      item: string
      stock: number
    },
  ]
  embed: [
    {
      dragon: string
      item: string
      stock: number
    },
  ]
  hp: number
  damage: number
  critical: number
  rooms: [
    {
      chapter: number
      damage: number
      hp: number
      level: number
      section: number
    },
  ]
  room: any
  chapter: number
  section: number
  wall: number
  energy: number
  meat: Number
  dragons:
    | Array<{
        dragonName: string
        dragonNo: number
        hp: Number
        critical: Number
        wall: Number
        energy: Number
        exp: Number
        rarity: Number
        damage: Number
        level: Number
      }>
    | []
  currentDragonName: string | ''
  hunterLevel:number
  attacking: boolean
  miningStatus: boolean
  loadingStatus: boolean
}

export let global: UserProfile = {
  walletAddress: '',
  userRef: '',
  ref: '',
  referals: 0,
  exp: 100,
  rarity: 0,
  level: 0,
  purchase: [
    {
      dragon: '',
      item: 'gem-1',
      stock: 0,
    },
  ],
  embed: [
    {
      dragon: '',
      item: 'gem-1',
      stock: 0,
    },
  ],
  hp: 1500,
  damage: 150,
  critical: 80,
  rooms: [
    {
      chapter: 1,
      damage: 150,
      hp: 80,
      level: 1,
      section: 1,
    },
  ],
  room: [
    {
      chapter: 1,
      section: 1,
    },
  ],
  chapter: 1,
  section: 1,
  wall: 0,
  energy: 1000,
  meat: 0,
  dragons: [],
  currentDragonName: '',
  hunterLevel:0,
  attacking: false,
  miningStatus: false,
  loadingStatus: true,
}

export const changeItem = (resp: any) => {
  global.hp = resp.dragons.hp
  global.damage = resp.dragons.damage
  global.critical = resp.dragons.critical
  global.purchase = resp.purchase
  global.embed = resp.embed
  global.exp = resp.dragons.exp
  global.rarity = resp.dragons.rarity
  global.energy = resp.dragons.energy
  global.meat = resp.meat
  global.currentDragonName = resp.currentDragonName
  global.level = resp.level
  global.wall = resp.wall
  global.hunterLevel = resp.hunterLevel
}
