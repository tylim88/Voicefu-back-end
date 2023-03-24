import { auth } from 'firebase-functions'
import { users } from './firestore'
import { deleteDoc } from 'firelord'

export const onUserDelete = auth.user().onDelete((user) => {
    try {
        return deleteDoc(users.doc(user.uid))
    } catch (e) {
        console.error(e)
    }
})
