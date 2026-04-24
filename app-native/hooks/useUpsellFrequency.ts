import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UPSELL_LAST_MODAL_KEY = '@upsell_last_modal_time';
const UPSELL_POST_WORKOUT_COUNT_KEY = '@upsell_post_workout_count';

const MODAL_COOLDOWN_MS = 12 * 60 * 60 * 1000;
const POST_WORKOUT_FREQUENCY = 3;

export function useUpsellFrequency() {
    const [canShowFullModal, setCanShowFullModal] = useState<boolean>(false);
    const [canShowPostWorkoutCard, setCanShowPostWorkoutCard] = useState<boolean>(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkFrequency = async () => {
            try {
                const lastModalTimeString = await AsyncStorage.getItem(UPSELL_LAST_MODAL_KEY);
                const postWorkoutCountString = await AsyncStorage.getItem(UPSELL_POST_WORKOUT_COUNT_KEY);

                const now = Date.now();
                let showModal = true;
                let postWorkoutCount = postWorkoutCountString ? parseInt(postWorkoutCountString, 10) : 0;

                if (lastModalTimeString) {
                    const lastModalTime = parseInt(lastModalTimeString, 10);
                    if (now - lastModalTime < MODAL_COOLDOWN_MS) {
                        showModal = false;
                    }
                }

                setCanShowFullModal(showModal);
                setCanShowPostWorkoutCard(postWorkoutCount % POST_WORKOUT_FREQUENCY === 0);
                setIsReady(true);
            } catch (error) {
                setCanShowFullModal(false);
                setCanShowPostWorkoutCard(false);
                setIsReady(true);
            }
        };
        checkFrequency();
    }, []);

    const markModalShown = async () => {
        try {
            await AsyncStorage.setItem(UPSELL_LAST_MODAL_KEY, Date.now().toString());
            setCanShowFullModal(false);
        } catch (error) {
            console.error('Error saving modal time', error);
        }
    };

    const incrementPostWorkoutCount = async () => {
        try {
            const countString = await AsyncStorage.getItem(UPSELL_POST_WORKOUT_COUNT_KEY);
            const newCount = (countString ? parseInt(countString, 10) : 0) + 1;
            await AsyncStorage.setItem(UPSELL_POST_WORKOUT_COUNT_KEY, newCount.toString());
            setCanShowPostWorkoutCard(newCount % POST_WORKOUT_FREQUENCY === 0);
        } catch (error) {
            console.error('Error incrementing post workout count', error);
        }
    };

    return {
        canShowFullModal,
        canShowPostWorkoutCard,
        markModalShown,
        incrementPostWorkoutCount,
        isReady
    };
}
