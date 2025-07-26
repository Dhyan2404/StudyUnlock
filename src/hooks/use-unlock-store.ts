
import { useState, useEffect, useCallback } from 'react';
import { validateAndUseCode } from '@/services/unlock-service';

export type Subject = 'science' | 'math' | 'social-studies';
export const ALL_SUBJECTS: Subject[] = ['science', 'math', 'social-studies'];

// The value from the database can be different from the canonical subject name
const mapSubjectValue = (value: string): Subject | null => {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'science') return 'science';
    if (lowerValue === 'math') return 'math';
    if (lowerValue === 'social-studies' || lowerValue === 'socialstudies') return 'social-studies';
    return null;
}

const UNLOCKED_KEY = 'study-unlock-status';

export const useUnlockStore = () => {
    const [unlockedSubjects, setUnlockedSubjects] = useState<Subject[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedStatus = window.localStorage.getItem(UNLOCKED_KEY);
            if (storedStatus) {
                const parsedStatus = JSON.parse(storedStatus);
                if (Array.isArray(parsedStatus)) {
                    setUnlockedSubjects(parsedStatus);
                }
            }
        } catch (error) {
            console.error('Failed to load unlock status from localStorage', error);
        }
        setIsInitialized(true);
    }, []);

    const saveToLocalStorage = (subjects: Subject[]) => {
        try {
            window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(subjects));
        } catch (error) {
            console.error('Failed to save unlock status to localStorage', error);
        }
    };

    const unlockSubject = useCallback(async (code: string): Promise<{ success: boolean; subject: string | null }> => {
        const { success, subject: unlockedSubjectValue } = await validateAndUseCode(code);

        if (success && unlockedSubjectValue) {
             let newUnlockedSubjects: Subject[];
            if (unlockedSubjectValue === 'all') {
                newUnlockedSubjects = [...ALL_SUBJECTS];
            } else {
                const validSubject = mapSubjectValue(unlockedSubjectValue);
                if (validSubject && !unlockedSubjects.includes(validSubject)) {
                    newUnlockedSubjects = [...new Set([...unlockedSubjects, validSubject])];
                } else {
                    // It was either an invalid subject or already unlocked, but we still return success.
                    // The dialog logic will handle displaying the right message.
                    setUnlockedSubjects(unlockedSubjects); 
                    return { success: true, subject: unlockedSubjectValue };
                }
            }
            setUnlockedSubjects(newUnlockedSubjects);
            saveToLocalStorage(newUnlockedSubjects);
            return { success: true, subject: unlockedSubjectValue };
        }

        return { success: false, subject: null };
    }, [unlockedSubjects]);

    const isUnlocked = useCallback((subject: Subject): boolean => {
        return unlockedSubjects.includes(subject);
    }, [unlockedSubjects]);

    return { isUnlocked, unlockSubject, isInitialized, unlockedSubjects, setUnlockedSubjects };
};
