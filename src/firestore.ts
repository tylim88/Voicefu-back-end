import { MetaTypeCreator } from 'firelord'
import { getFirelord, getFirestore } from 'firelord'
import { app } from './firebase'

export type Users = MetaTypeCreator<
    {
        freeToken: number
    },
    'Users'
>

export const db = getFirestore(app)
export const users = getFirelord<Users>(db, 'Users')
