import { ImageSourcePropType } from 'react-native';
import { resolveCanonicalExercise } from './exercises';

const exactAssets: Record<string, any> = {
    // 10 Valid Pre-Generated Core Images
    'ex_barbell_squat': require('../assets/images/exercises/ex_barbell_squat.png'),
    'ex_front_squat': require('../assets/images/exercises/ex_front_squat.png'),
    'ex_romanian_deadlift': require('../assets/images/exercises/ex_romanian_deadlift.png'),
    'ex_deadlift': require('../assets/images/exercises/ex_deadlift.png'),
    'ex_leg_press': require('../assets/images/exercises/ex_leg_press.png'),
    'ex_hack_squat': require('../assets/images/exercises/ex_hack_squat.png'),
    'ex_leg_extension': require('../assets/images/exercises/ex_leg_extension.png'),
    'ex_leg_curl': require('../assets/images/exercises/ex_leg_curl.png'),
    'ex_bulgarian_split_squat': require('../assets/images/exercises/ex_bulgarian_split_squat.png'),
    'ex_standing_calf_raise': require('../assets/images/exercises/ex_standing_calf_raise.png'),
    'ex_seated_calf_raise': require('../assets/images/exercises/ex_seated_calf_raise.png'),

    // Chest Valid Images
    'ex_barbell_bench_press': require('../assets/images/exercises/exercise_bench_press.png'),
    'ex_incline_db_press': require('../assets/images/exercises/ex_incline_db_press.png'),
    'ex_flat_db_press': require('../assets/images/exercises/ex_flat_db_press.png'),
    'ex_machine_chest_press': require('../assets/images/exercises/ex_machine_chest_press.png'),
    'ex_incline_mach_press': require('../assets/images/exercises/ex_incline_mach_press.png'),
    'ex_cable_crossover': require('../assets/images/exercises/ex_cable_crossover.png'),
    'ex_pec_deck': require('../assets/images/exercises/ex_pec_deck.png'),
    'ex_pushup': require('../assets/images/exercises/ex_pushup.png'),

    // Back Valid Images
    'ex_pullup': require('../assets/images/exercises/exercise_pullup.png'),
    'ex_barbell_row': require('../assets/images/exercises/ex_barbell_row.png'),
    'ex_dumbbell_row': require('../assets/images/exercises/ex_dumbbell_row.png'),
    'ex_lat_pulldown': require('../assets/images/exercises/ex_lat_pulldown.png'),
    'ex_seated_cable_row': require('../assets/images/exercises/ex_seated_cable_row.png'),
    'ex_tbar_row': require('../assets/images/exercises/ex_tbar_row.png'),
    'ex_chest_supp_row': require('../assets/images/exercises/ex_chest_supp_row.png'),
    'ex_machine_row': require('../assets/images/exercises/ex_machine_row.png'),

    // Shoulders & Arms (Batch 3 Validated)
    'ex_overhead_press': require('../assets/images/exercises/ex_overhead_press.png'),
    'ex_seated_db_press': require('../assets/images/exercises/ex_seated_db_press.png'),
    'ex_lateral_raise': require('../assets/images/exercises/ex_lateral_raise.png'),
    'ex_mach_lateral_raise': require('../assets/images/exercises/ex_mach_lateral_raise.png'),
    'ex_cable_lat_raise': require('../assets/images/exercises/ex_cable_lat_raise.png'),
    'ex_rear_delt_fly': require('../assets/images/exercises/ex_rear_delt_fly.png'),
    'ex_reverse_pec_deck': require('../assets/images/exercises/ex_reverse_pec_deck.png'),
    'ex_face_pull': require('../assets/images/exercises/ex_face_pull.png'),
    'ex_barbell_curl': require('../assets/images/exercises/ex_barbell_curl.png'),
    'ex_dumbbell_curl': require('../assets/images/exercises/ex_dumbbell_curl.png'),

    // 4 Muscle groups (Using some as Fallbacks until generation quota resets!)
    'Chest': require('../assets/images/muscle-groups/muscle_chest.png'),
    'Back': require('../assets/images/muscle-groups/muscle_back.png'),
    'Legs': require('../assets/images/muscle-groups/muscle_legs.png'),
    'Arms': require('../assets/images/muscle-groups/muscle_arms.png'),
};

// Map ALL 50 keys intentionally, statically, and explicitly to a physical fallback asset so it never guesses strings loosely
const explicitImageMap: Record<string, any> = {
    'ex_barbell_squat': exactAssets['ex_barbell_squat'],
    'ex_front_squat': exactAssets['ex_front_squat'],
    'ex_romanian_deadlift': exactAssets['ex_romanian_deadlift'],
    'ex_deadlift': exactAssets['ex_deadlift'],
    'ex_leg_press': exactAssets['ex_leg_press'],
    'ex_hack_squat': exactAssets['ex_hack_squat'],
    'ex_leg_extension': exactAssets['ex_leg_extension'],
    'ex_leg_curl': exactAssets['ex_leg_curl'],
    'ex_barbell_bench_press': exactAssets['ex_barbell_bench_press'],
    'ex_pullup': exactAssets['ex_pullup'],

    // All other leg exercises natively mapped
    'ex_bulgarian_split_squat': exactAssets['ex_bulgarian_split_squat'],
    'ex_standing_calf_raise': exactAssets['ex_standing_calf_raise'],
    'ex_seated_calf_raise': exactAssets['ex_seated_calf_raise'],

    // Chest natively mapped
    'ex_incline_db_press': exactAssets['ex_incline_db_press'],
    'ex_flat_db_press': exactAssets['ex_flat_db_press'],
    'ex_machine_chest_press': exactAssets['ex_machine_chest_press'],
    'ex_incline_mach_press': exactAssets['ex_incline_mach_press'],
    'ex_cable_crossover': exactAssets['ex_cable_crossover'],
    'ex_pec_deck': exactAssets['ex_pec_deck'],
    'ex_pushup': exactAssets['ex_pushup'],

    // Back natively mapped
    'ex_barbell_row': exactAssets['ex_barbell_row'],
    'ex_dumbbell_row': exactAssets['ex_dumbbell_row'],
    'ex_lat_pulldown': exactAssets['ex_lat_pulldown'],
    'ex_seated_cable_row': exactAssets['ex_seated_cable_row'],
    'ex_tbar_row': exactAssets['ex_tbar_row'],
    'ex_chest_supp_row': exactAssets['ex_chest_supp_row'],
    'ex_machine_row': exactAssets['ex_machine_row'],
    'ex_straight_arm_pull': exactAssets['Back'],

    // Shoulders (Batch 3 Validation Complete)
    'ex_overhead_press': exactAssets['ex_overhead_press'],
    'ex_seated_db_press': exactAssets['ex_seated_db_press'],
    'ex_lateral_raise': exactAssets['ex_lateral_raise'],
    'ex_mach_lateral_raise': exactAssets['ex_mach_lateral_raise'],
    'ex_cable_lat_raise': exactAssets['ex_cable_lat_raise'],
    'ex_rear_delt_fly': exactAssets['ex_rear_delt_fly'],
    'ex_reverse_pec_deck': exactAssets['ex_reverse_pec_deck'],
    'ex_face_pull': exactAssets['ex_face_pull'],

    // Arms 
    'ex_barbell_curl': exactAssets['ex_barbell_curl'],
    'ex_dumbbell_curl': exactAssets['ex_dumbbell_curl'],
    'ex_hammer_curl': exactAssets['Arms'],
    'ex_preacher_curl': exactAssets['Arms'],
    'ex_cable_curl': exactAssets['Arms'],
    'ex_tricep_pushdown': exactAssets['Arms'],
    'ex_overhead_tricep_ext': exactAssets['Arms'],
    'ex_skull_crusher': exactAssets['Arms'],
    'ex_close_grip_bench': exactAssets['Arms'],
    'ex_concentration_curl': exactAssets['Arms'],

    // Core
    'ex_crunch': exactAssets['Chest'],
    'ex_hanging_leg_raise': exactAssets['Chest'],
    'ex_cable_crunch': exactAssets['Chest'],
    'ex_plank': exactAssets['Chest'],
};

export function getExerciseImage(exerciseName: string, targetOutput?: string): ImageSourcePropType | null {
    if (!exerciseName) return null;

    const matchedCanonical = resolveCanonicalExercise(exerciseName);

    // 1. Explicit Dictionary Lookup (No fuzzy strings allowed)
    if (matchedCanonical && explicitImageMap[matchedCanonical.image_key]) {
        return explicitImageMap[matchedCanonical.image_key];
    }

    // 2. Custom exercise or unmatched string - Strict pure Muscle target check via target output only
    const muscleGroupTarget = (matchedCanonical?.muscle_group || targetOutput || '').toLowerCase();

    if (muscleGroupTarget.includes('chest') || muscleGroupTarget.includes('pec')) return exactAssets['Chest'];
    if (muscleGroupTarget.includes('back') || muscleGroupTarget.includes('lat')) return exactAssets['Back'];
    if (muscleGroupTarget.includes('leg') || muscleGroupTarget.includes('quad') || muscleGroupTarget.includes('calfv')) return exactAssets['Legs'];
    if (muscleGroupTarget.includes('arm') || muscleGroupTarget.includes('bicep') || muscleGroupTarget.includes('tricep')) return exactAssets['Arms'];
    if (muscleGroupTarget.includes('shoulder') || muscleGroupTarget.includes('delt')) return exactAssets['Chest']; // Temp

    // 3. Absolute generic fallback
    return null;
}
