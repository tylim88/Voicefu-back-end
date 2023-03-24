import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import serviceAccount from '../env.json'
import { getAuth } from 'firebase-admin/auth'

export const app = initializeApp({
    credential: cert(serviceAccount['firebase'] as ServiceAccount),
})
export const auth = getAuth(app)
