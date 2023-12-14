import type { Withdraw } from '../store/user/action-types'

import api from './callApi'
import { fetchData } from './fetchData'

const isWithin24h = (date: string): boolean => {
  return new Date(date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000
}

export const getBcsPrice = async (): Promise<number> => {
  return (await fetchData(`/user/get-bcs-price`, 'GET')).price
}

export const getWithdrewDrgAmount = (withdraws: Withdraw[]): number => {
  if (withdraws && withdraws.length > 0) {
    // const amounts = withdraws.map((item: Withdraw) => parseInt(item.amount))
    const amount = withdraws.reduce((prev: number, current: Withdraw) => {
      return prev + parseInt(current.amount, 10)
    }, 0)

    return amount
  } else return 0
}
