
import { getEventsByQuery, getAndUpdateEventByQuery } from '@/lib/handlers'

export default function eventMedia() {
    async function docIsValid(query: Record<string, unknown>) {
        const docs = await getEventsByQuery(query, {limit: 1})
        return docs[0]
    }

    async function updateDoc(query: Record<string, unknown>, update: Record<string, unknown>) {
        const updatedDoc = await getAndUpdateEventByQuery(query, update, false)
        return updatedDoc
    }

    return {
        docIsValid,
        updateDoc
    }
}