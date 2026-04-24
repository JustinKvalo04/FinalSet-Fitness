import { ImageSourcePropType } from 'react-native';
import { resolveCanonicalExercise } from './exercises';

const exactAssets: Record<string, any> = {
    // 10 Valid Pre-Generated Core Images
    'ex_barbell_squat': require('../assets/images/exercises/ex_barbell_squat_v2.png'),
    'ex_front_squat': require('../assets/images/exercises/ex_front_squat_v2.png'),
    'ex_romanian_deadlift': require('../assets/images/exercises/ex_romanian_deadlift.png'),
    'ex_deadlift': require('../assets/images/exercises/ex_deadlift.png'),
    'ex_leg_press': require('../assets/images/exercises/ex_leg_press.png'),
    'ex_hack_squat': require('../assets/images/exercises/ex_hack_squat.png'),
    'ex_leg_extension': require('../assets/images/exercises/ex_leg_extension.png'),
    'ex_leg_curl': require('../assets/images/exercises/ex_leg_curl.png'),
    'ex_bulgarian_split_squat': require('../assets/images/exercises/ex_bulgarian_split_squat.png'),
    'ex_standing_calf_raise': require('../assets/images/exercises/ex_standing_calf_raise_v4.png'),
    'ex_seated_calf_raise': require('../assets/images/exercises/ex_seated_calf_raise_v2.png'),
    'ex_barbell_hip_thrust': require('../assets/images/exercises/ex_barbell_hip_thrust.png'),
    'ex_cable_kickback': require('../assets/images/exercises/ex_cable_kickback.png'),
    'ex_walking_lunge': require('../assets/images/exercises/ex_walking_lunge.png'),
    'ex_hip_abductor': require('../assets/images/exercises/ex_hip_abductor.png'),

    // Chest Valid Images
    'ex_barbell_bench_press': require('../assets/images/exercises/exercise_bench_press.png'),
    'ex_incline_db_press': require('../assets/images/exercises/ex_incline_db_press_v3.png'),
    'ex_flat_db_press': require('../assets/images/exercises/ex_flat_db_press.png'),
    'ex_machine_chest_press': require('../assets/images/exercises/ex_machine_chest_press.png'),
    'ex_incline_mach_press': require('../assets/images/exercises/ex_incline_mach_press.png'),
    'ex_cable_crossover': require('../assets/images/exercises/ex_cable_crossover_v5.png'),
    'ex_pec_deck': require('../assets/images/exercises/ex_pec_deck.png'),
    'ex_pushup': require('../assets/images/exercises/ex_pushup.png'),

    // Back Valid Images
    'ex_pullup': require('../assets/images/exercises/ex_pullup_v2.png'),
    'ex_barbell_row': require('../assets/images/exercises/ex_barbell_row.png'),
    'ex_dumbbell_row': require('../assets/images/exercises/ex_dumbbell_row.png'),
    'ex_lat_pulldown': require('../assets/images/exercises/ex_lat_pulldown.png'),
    'ex_seated_cable_row': require('../assets/images/exercises/ex_seated_cable_row_v3.png'),
    'ex_tbar_row': require('../assets/images/exercises/ex_tbar_row_v4.png'),
    'ex_chest_supp_row': require('../assets/images/exercises/ex_chest_supp_row.png'),
    'ex_machine_row': require('../assets/images/exercises/ex_machine_row.png'),

    // Shoulders & Arms (Batch 3 Validated)
    'ex_overhead_press': require('../assets/images/exercises/ex_overhead_press.png'),
    'ex_seated_db_press': require('../assets/images/exercises/ex_seated_db_press.png'),
    'ex_lateral_raise': require('../assets/images/exercises/ex_lateral_raise.png'),
    'ex_mach_lateral_raise': require('../assets/images/exercises/ex_mach_lat_raise_v2.png'),
    'ex_cable_lat_raise': require('../assets/images/exercises/ex_cable_lat_raise_v2.png'),
    'ex_rear_delt_fly': require('../assets/images/exercises/ex_rear_delt_fly.png'),
    'ex_front_raise': require('../assets/images/exercises/ex_front_raise_v4.png'),
    'ex_dumbbell_shrug': require('../assets/images/exercises/ex_dumbbell_shrug_v4.png'),
    'ex_reverse_pec_deck': require('../assets/images/exercises/ex_reverse_pec_deck.png'),
    'ex_face_pull': require('../assets/images/exercises/ex_face_pull_v3.png'),
    'ex_barbell_curl': require('../assets/images/exercises/ex_barbell_curl_v5.png'),
    'ex_dumbbell_curl': require('../assets/images/exercises/ex_dumbbell_curl.png'),

    // Arms (Batch 4 Core)
    'ex_hammer_curl': require('../assets/images/exercises/ex_hammer_curl.png'),
    'ex_preacher_curl': require('../assets/images/exercises/ex_preacher_curl.png'),
    'ex_cable_curl': require('../assets/images/exercises/ex_cable_curl.png'),
    'ex_tricep_pushdown': require('../assets/images/exercises/ex_tricep_pushdown.png'),
    'ex_overhead_tricep_ext': require('../assets/images/exercises/ex_overhead_tricep_ext.png'),
    'ex_skull_crusher': require('../assets/images/exercises/ex_skull_crusher.png'),
    'ex_close_grip_bench': require('../assets/images/exercises/ex_close_grip_bench.png'),
    'ex_concentration_curl': require('../assets/images/exercises/ex_concentration_curl.png'),

    // Core (Batch 4 Core)
    'ex_crunch': require('../assets/images/exercises/ex_crunch.png'),
    'ex_hanging_leg_raise': require('../assets/images/exercises/ex_hanging_leg_raise.png'),

    // Batch 5 Final Replacements & Core
    'ex_straight_arm_pull': require('../assets/images/exercises/ex_straight_arm_pull_v2.png'),
    'ex_dumbbell_pullover': require('../assets/images/exercises/ex_dumbbell_pullover.png'),
    'ex_cable_crunch': require('../assets/images/exercises/ex_cable_crunch.png'),
    'ex_plank': require('../assets/images/exercises/ex_plank.png'),

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
    'ex_barbell_hip_thrust': exactAssets['ex_barbell_hip_thrust'],
    'ex_cable_kickback': exactAssets['ex_cable_kickback'],
    'ex_walking_lunge': exactAssets['ex_walking_lunge'],
    'ex_hip_abductor': exactAssets['ex_hip_abductor'],
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
    'ex_straight_arm_pull': exactAssets['ex_straight_arm_pull'],
    'ex_dumbbell_pullover': exactAssets['ex_dumbbell_pullover'],

    // Shoulders (Batch 3 Validation Complete)
    'ex_overhead_press': exactAssets['ex_overhead_press'],
    'ex_seated_db_press': exactAssets['ex_seated_db_press'],
    'ex_lateral_raise': exactAssets['ex_lateral_raise'],
    'ex_mach_lateral_raise': exactAssets['ex_mach_lateral_raise'],
    'ex_cable_lat_raise': exactAssets['ex_cable_lat_raise'],
    'ex_rear_delt_fly': exactAssets['ex_rear_delt_fly'],
    'ex_front_raise': exactAssets['ex_front_raise'],
    'ex_dumbbell_shrug': exactAssets['ex_dumbbell_shrug'],
    'ex_reverse_pec_deck': exactAssets['ex_reverse_pec_deck'],
    'ex_face_pull': exactAssets['ex_face_pull'],

    // Arms 
    'ex_barbell_curl': exactAssets['ex_barbell_curl'],
    'ex_dumbbell_curl': exactAssets['ex_dumbbell_curl'],
    'ex_hammer_curl': exactAssets['ex_hammer_curl'],
    'ex_preacher_curl': exactAssets['ex_preacher_curl'],
    'ex_cable_curl': exactAssets['ex_cable_curl'],
    'ex_tricep_pushdown': exactAssets['ex_tricep_pushdown'],
    'ex_overhead_tricep_ext': exactAssets['ex_overhead_tricep_ext'],
    'ex_skull_crusher': exactAssets['ex_skull_crusher'],
    'ex_close_grip_bench': exactAssets['ex_close_grip_bench'],
    'ex_concentration_curl': exactAssets['ex_concentration_curl'],

    // Core
    'ex_crunch': exactAssets['ex_crunch'],
    'ex_hanging_leg_raise': exactAssets['ex_hanging_leg_raise'],
    'ex_cable_crunch': exactAssets['ex_cable_crunch'],
    'ex_plank': exactAssets['ex_plank'],
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
    if (muscleGroupTarget.includes('shoulder') || muscleGroupTarget.includes('delt')) return exactAssets['ex_lateral_raise'];

    // 3. Absolute generic fallback
    return null;
}
