import axios from "axios";
import { global } from './global'
import config from '../utils/config'
// import { fetchData } from "../utils/fetchData";

axios.defaults.baseURL = `${config.server}:${config.baseURL}`
// axios.defaults.baseURL = `${config.server}${config.baseURL}`

export const getProfile = async (walletAddress: string, character: string) => {
    const data = (await axios.post('/user/profile', {
        walletAddress,
        character
    })).data
    const user = data.user
    let currentDragon = user.dragons.filter((dragon: any) => dragon.dragonName === user.currentDragonName)[0]
    global.hp = currentDragon.hp
    global.damage = currentDragon.damage
    global.critical = currentDragon.critical
    global.purchase = data.purchase
    global.embed = data.embed
    global.exp = currentDragon.exp
    global.rarity = currentDragon.rarity
    global.room = user.room
    global.userRef = user.userRef
    global.wall = user.wall
    global.energy = currentDragon.energy
    global.dragons = user.dragons
    global.currentDragonName = user.currentDragonName
    global.level = user.level
    global.hunterLevel = user.hunterLevel
}
export const referalAdd = async () => {
    await axios.post('/user/referal', {
        guest: global.userRef,
        introducer: global.ref,
    })
}
export const getRoom = async () => {
    const rooms = await (await axios.post('/user/room', {})).data.room
    global.rooms = rooms
}
export const setCurrentDragon = async (dragon: string) => {
    await (await axios.post("/user/current-dragon", { walletAddress: global.walletAddress, dragon: dragon })).data.room
}
export const itemModify = async (walletAddress: string, dragon: string = 'siren-1', item: string, amount: number, currentChaper: number, currentSection: number, selectChapter: number, selectSection: number, cb: Function) => {
    const data = (await axios.post('/user/item', {
        walletAddress,
        dragon,
        item,
        amount,
        currentChaper,
        currentSection,
        selectChapter,
        selectSection,
    })).data;
    const user = data.user
    let currentDragon = user.dragons.filter((dragon: any) => dragon.dragonName === user.currentDragonName)[0]
    global.room = user.room
    cb({
        dragons: currentDragon,
        purchase: data.purchase,
        embed: data.embed,
        room: user.room,
        currentDragonName: dragon
    });
}

export const itemRevive = async (walletAddress: string, dragon: string = 'siren-1', item: string, cb: Function) => {
    const data = (await axios.post('/user/item/revive', {
        walletAddress,
        dragon,
        item
    })).data;
    const user = data.user

    let currentDragon = user.dragons.filter((dragon: any) => dragon.dragonName === user.currentDragonName)[0]
    cb({
        dragons: currentDragon,
        purchase: data.purchase,
        embed: data.embed,
        room: user.room,
        currentDragonName: dragon

    });
}

export const energySwap = async (walletAddress: string, dragon: string = 'siren-1', amount: Number, cb: Function) => {
    const data = (await axios.post('/user/swap/energy', {
        walletAddress,
        dragon,
        amount
    })).data;
    let currentDragon = data.dragons.filter((dragon: any) => dragon.dragonName === data.currentDragonName)[0]

    cb({
        energy: currentDragon.energy,
        meat: data.meat,
    });
}