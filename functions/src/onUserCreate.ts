import { auth } from 'firebase-functions'
import { users } from './firestore'
import { createDoc } from 'firelord'

export const onUserCreate = auth.user().onCreate((user) => {
    try {
        return createDoc(users.doc(user.uid), { freeToken: 1000 })
    } catch (e) {
        console.error(e)
    }
})
