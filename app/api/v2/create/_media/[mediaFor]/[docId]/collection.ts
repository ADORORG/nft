
import { getCollectionsByQuery, getAndUpdateCollectionByQuery} from '@/lib/handlers'

export default function collectionMedia() {

    async function docIsValid(query: Record<string, unknown>) {
        const docs = await getCollectionsByQuery(query, {limit: 1})
        return docs[0]
    }

    async function updateDoc(query: Record<string, unknown>, update: Record<string, unknown>) {
        const updatedDoc = await getAndUpdateCollectionByQuery(query, update, false)
        return updatedDoc
    }

    return {
        docIsValid,
        updateDoc
    }
}