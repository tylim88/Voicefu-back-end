import { pubsub } from 'firebase-functions'
import { users } from './firestore'
import { getDocs, updateDoc } from 'firelord'

export const onMonthlyTokenRest = pubsub
    .schedule('0 0 1 * *')
    .timeZone('America/New_York')
    .onRun(async () => {
        try {
            const snapshots = await getDocs(users.collection())
            await Promise.all(
                snapshots.docs.map((doc) => {
                    const uid = doc.id
                    return updateDoc(users.doc(uid), { freeToken: 1000 })
                })
            )
        } catch (e) {
            console.error(e)
        }
    })
