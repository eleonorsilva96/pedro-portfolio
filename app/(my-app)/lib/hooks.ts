import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

// this way we type the function so it knows what to expect 
// for the input and output using CollectionAfterChangeHook, GlobalAfterChangeHook, etc 
export const revalidateCollectionAfterChange = (path: string): CollectionAfterChangeHook => {
    // Destructures the doc from the Payload data
    return ({ doc }) => {
        // Invalidates the specific page cache so the Next server fetches data again from the CMS
        revalidatePath(path)

        return doc
    }
}
export const revalidateCollectionAfterDelete = (path: string): CollectionAfterDeleteHook => {
    // Destructures the doc from the Payload data
    return ({ doc }) => {
        console.log(`collection delete path: ${path}`) 
        // Invalidates the specific page cache so the Next server fetches data again from the CMS
        revalidatePath(path)

        return doc
    }
}
export const revalidateGlobal = (path: string): GlobalAfterChangeHook => {
    // Destructures the doc from the Payload data
    return ({ doc }) => {
        // Invalidates the specific page cache so the Next server fetches data again from the CMS
        revalidatePath(path)

        return doc
    }
}