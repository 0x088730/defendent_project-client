import axios from "axios";
import { global } from './global'
import config from '../utils/config'
import { fetchData } from "../utils/fetchData";

axios.defaults.baseURL = `${config.server}:${config.port}${config.baseURL}`

export const getProfile = async (walletAddress: string, dragon: string) => {
    const data = { walletAddress, dragon }
    await fetchData("/user/profile", "POST", data)
        .then(data => {
            const user = data.user;
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
        })
        .catch(err => console.log(err));
}

export const referalAdd = async () => {
    const data = {
        guest: global.userRef,
        introducer: global.ref,
    }
    await fetchData("/user/referal", "POST", data)
}
export const getRoom = async () => {
    const data = {}
    await fetchData("/user/room", "POST", data)
        .then(data =>
            global.rooms = data.room
        )
}
export const setCurrentDragon = async (dragon: string) => {
    const data = { walletAddress: global.walletAddress, dragon: dragon }
    await fetchData("/user/current-dragon", "POST", data)
}
export const itemModify = async (walletAddress: string, dragon: string = 'siren-1', item: string, amount: number, currentChaper: number, currentSection: number, selectChapter: number, selectSection: number, cb: Function) => {
    const data = {
        walletAddress,
        dragon,
        item,
        amount,
        currentChaper,
        currentSection,
        selectChapter,
        selectSection,
    }
    await fetchData("/user/item", "POST", data)
        .then(data => {
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
        })
}

export const itemRevive = async (walletAddress: string, dragon: string = 'siren-1', item: string, cb: Function) => {
    const data = {
        walletAddress,
        dragon,
        item
    }
    await fetchData("/user/revive", "POST", data)
        .then(data => {
            const user = data.user

            let currentDragon = user.dragons.filter((dragon: any) => dragon.dragonName === user.currentDragonName)[0]
            cb({
                dragons: currentDragon,
                purchase: data.purchase,
                embed: data.embed,
                room: user.room,
                currentDragonName: dragon

            });
        })
}

export const energySwap = async (walletAddress: string, dragon: string = 'siren-1', amount: Number, cb: Function) => {
    const data = {
        walletAddress,
        dragon,
        amount
    }
    await fetchData("/user/swap/energy", "POST", data)
        .then(data => {
            let currentDragon = data.dragons.filter((dragon: any) => dragon.dragonName === data.currentDragonName)[0]

            cb({
                energy: currentDragon.energy,
                meat: data.meat,
            });
        })
}