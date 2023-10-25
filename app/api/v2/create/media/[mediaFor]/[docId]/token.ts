
import { getTokensByQuery, getAndUpdateTokenByQuery } from '@/lib/handlers'

export default function tokenMedia() {
    
    async function docIsValid(query: Record<string, unknown>) {
        const docs = await getTokensByQuery(query, {limit: 1})
        return docs[0]
    }

    async function updateDoc(query: Record<string, unknown>, update: Record<string, unknown>) {
        const updatedDoc = await getAndUpdateTokenByQuery(query, update, false)
        return updatedDoc
    }

    return {
        docIsValid,
        updateDoc
    }
}