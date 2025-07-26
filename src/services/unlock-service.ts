import { db } from '@/lib/firebase';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';

export type UnlockCode = {
    id: string;
    subject: string; // Allow any string, validation happens in the hook
    used: boolean;
};

const CODES_COLLECTION = 'unlockCodes';

/**
 * Validates an unlock code against Firestore and marks it as used if it's valid.
 * 
 * To add codes, go to your Firebase Console -> Firestore Database -> unlockCodes collection.
 * Add a new document. The document ID should be the unlock code (e.g., "SCIENCE123").
 * The document should have two fields:
 * - subject: (string) one of 'science', 'math', 'socialstudies', 'social-studies', or 'all'
 * - used: (boolean) set to false
 */
export const validateAndUseCode = async (code: string): Promise<{ success: boolean; subject: string | null }> => {
    if (!code) return { success: false, subject: null };

    const codeRef = doc(db, CODES_COLLECTION, code);

    try {
        const docSnap = await getDoc(codeRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as Omit<UnlockCode, 'id'>;
            if (data.used) {
                console.log(`Code ${code} has already been used.`);
                return { success: false, subject: null };
            }
            
            // Mark the code as used in a transaction
            const batch = writeBatch(db);
            batch.update(codeRef, { used: true });
            await batch.commit();
            
            console.log(`Successfully validated and used code: ${code}`);
            return { success: true, subject: data.subject };
        } else {
            console.log(`Code ${code} does not exist.`);
            return { success: false, subject: null };
        }
    } catch (error) {
        console.error("Error validating code:", error);
        return { success: false, subject: null };
    }
};
