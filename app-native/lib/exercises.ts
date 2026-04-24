export type CanonicalExercise = {
    canonical_name: string;
    muscle_group: string;
    image_key: string;
};

export const CANONICAL_EXERCISES: CanonicalExercise[] = [
    // Legs
    { canonical_name: "Barbell Squat", muscle_group: "Legs", image_key: "ex_barbell_squat" },
    { canonical_name: "Front Squat", muscle_group: "Legs", image_key: "ex_front_squat" },
    { canonical_name: "Romanian Deadlift", muscle_group: "Legs", image_key: "ex_romanian_deadlift" },
    { canonical_name: "Deadlift", muscle_group: "Legs", image_key: "ex_deadlift" },
    { canonical_name: "Leg Press", muscle_group: "Legs", image_key: "ex_leg_press" },
    { canonical_name: "Hack Squat", muscle_group: "Legs", image_key: "ex_hack_squat" },
    { canonical_name: "Leg Extension", muscle_group: "Legs", image_key: "ex_leg_extension" },
    { canonical_name: "Leg Curl", muscle_group: "Legs", image_key: "ex_leg_curl" },
    { canonical_name: "Bulgarian Split Squat", muscle_group: "Legs", image_key: "ex_bulgarian_split_squat" },
    { canonical_name: "Standing Calf Raise", muscle_group: "Legs", image_key: "ex_standing_calf_raise" },
    { canonical_name: "Seated Calf Raise", muscle_group: "Legs", image_key: "ex_seated_calf_raise" },
    { canonical_name: "Barbell Hip Thrust", muscle_group: "Legs", image_key: "ex_barbell_hip_thrust" },
    { canonical_name: "Cable Kickback", muscle_group: "Legs", image_key: "ex_cable_kickback" },
    { canonical_name: "Walking Lunge", muscle_group: "Legs", image_key: "ex_walking_lunge" },
    { canonical_name: "Hip Abductor Machine", muscle_group: "Legs", image_key: "ex_hip_abductor" },

    // Chest
    { canonical_name: "Barbell Bench Press", muscle_group: "Chest", image_key: "ex_barbell_bench_press" },
    { canonical_name: "Incline Dumbbell Press", muscle_group: "Chest", image_key: "ex_incline_db_press" },
    { canonical_name: "Flat Dumbbell Press", muscle_group: "Chest", image_key: "ex_flat_db_press" },
    { canonical_name: "Machine Chest Press", muscle_group: "Chest", image_key: "ex_machine_chest_press" },
    { canonical_name: "Incline Machine Press", muscle_group: "Chest", image_key: "ex_incline_mach_press" },
    { canonical_name: "Cable Crossover", muscle_group: "Chest", image_key: "ex_cable_crossover" },
    { canonical_name: "Pec Deck", muscle_group: "Chest", image_key: "ex_pec_deck" },
    { canonical_name: "Push-Up", muscle_group: "Chest", image_key: "ex_pushup" },

    // Back
    { canonical_name: "Barbell Row", muscle_group: "Back", image_key: "ex_barbell_row" },
    { canonical_name: "Dumbbell Row", muscle_group: "Back", image_key: "ex_dumbbell_row" },
    { canonical_name: "Lat Pulldown", muscle_group: "Back", image_key: "ex_lat_pulldown" },
    { canonical_name: "Pull-Up", muscle_group: "Back", image_key: "ex_pullup" },
    { canonical_name: "Seated Cable Row", muscle_group: "Back", image_key: "ex_seated_cable_row" },
    { canonical_name: "T-Bar Row", muscle_group: "Back", image_key: "ex_tbar_row" },
    { canonical_name: "Chest Supported Row", muscle_group: "Back", image_key: "ex_chest_supp_row" },
    { canonical_name: "Machine Row", muscle_group: "Back", image_key: "ex_machine_row" },
    { canonical_name: "Straight Arm Pulldown", muscle_group: "Back", image_key: "ex_straight_arm_pull" },
    { canonical_name: "Dumbbell Pullover", muscle_group: "Chest", image_key: "ex_dumbbell_pullover" },

    // Shoulders
    { canonical_name: "Overhead Press", muscle_group: "Shoulders", image_key: "ex_overhead_press" },
    { canonical_name: "Seated Dumbbell Press", muscle_group: "Shoulders", image_key: "ex_seated_db_press" },
    { canonical_name: "Lateral Raise", muscle_group: "Shoulders", image_key: "ex_lateral_raise" },
    { canonical_name: "Front Raise", muscle_group: "Shoulders", image_key: "ex_front_raise" },
    { canonical_name: "Dumbbell Shrug", muscle_group: "Shoulders", image_key: "ex_dumbbell_shrug" },
    { canonical_name: "Machine Lateral Raise", muscle_group: "Shoulders", image_key: "ex_mach_lateral_raise" },
    { canonical_name: "Cable Lateral Raise", muscle_group: "Shoulders", image_key: "ex_cable_lat_raise" },
    { canonical_name: "Rear Delt Fly", muscle_group: "Shoulders", image_key: "ex_rear_delt_fly" },
    { canonical_name: "Reverse Pec Deck", muscle_group: "Shoulders", image_key: "ex_reverse_pec_deck" },
    { canonical_name: "Face Pull", muscle_group: "Shoulders", image_key: "ex_face_pull" },

    // Arms
    { canonical_name: "Barbell Curl", muscle_group: "Arms", image_key: "ex_barbell_curl" },
    { canonical_name: "Dumbbell Curl", muscle_group: "Arms", image_key: "ex_dumbbell_curl" },
    { canonical_name: "Hammer Curl", muscle_group: "Arms", image_key: "ex_hammer_curl" },
    { canonical_name: "Preacher Curl", muscle_group: "Arms", image_key: "ex_preacher_curl" },
    { canonical_name: "Cable Curl", muscle_group: "Arms", image_key: "ex_cable_curl" },
    { canonical_name: "Tricep Pushdown", muscle_group: "Arms", image_key: "ex_tricep_pushdown" },
    { canonical_name: "Overhead Tricep Extension", muscle_group: "Arms", image_key: "ex_overhead_tricep_ext" },
    { canonical_name: "Skull Crusher", muscle_group: "Arms", image_key: "ex_skull_crusher" },
    { canonical_name: "Close Grip Bench Press", muscle_group: "Arms", image_key: "ex_close_grip_bench" },
    { canonical_name: "Concentration Curl", muscle_group: "Arms", image_key: "ex_concentration_curl" },

    // Core
    { canonical_name: "Crunch", muscle_group: "Core", image_key: "ex_crunch" },
    { canonical_name: "Hanging Leg Raise", muscle_group: "Core", image_key: "ex_hanging_leg_raise" },
    { canonical_name: "Cable Crunch", muscle_group: "Core", image_key: "ex_cable_crunch" },
    { canonical_name: "Plank", muscle_group: "Core", image_key: "ex_plank" },
];

export const EXERCISE_ALIASES: Record<string, string> = {
    // Chest
    "flat bench press": "Barbell Bench Press",
    "bench press": "Barbell Bench Press",
    "chest press machine": "Machine Chest Press",
    "cable fly": "Cable Crossover",
    "cable flyes": "Cable Crossover",
    "incline db press": "Incline Dumbbell Press",
    "incline db presses": "Incline Dumbbell Press",
    "incline press": "Incline Dumbbell Press",
    "dumbbell press": "Flat Dumbbell Press",
    "db press": "Flat Dumbbell Press",
    "barbell press": "Barbell Bench Press",
    "pec deck machine": "Pec Deck",
    "pushups": "Push-Up",
    "push ups": "Push-Up",
    "pec deck": "Pec Deck",
    "cable crossover": "Cable Crossover",
    "cable crossovers": "Cable Crossover",

    // Back
    "barbell rows": "Barbell Row",
    "bent over row": "Barbell Row",
    "bent over rows": "Barbell Row",
    "db row": "Dumbbell Row",
    "dumbbell rows": "Dumbbell Row",
    "lat pulldowns": "Lat Pulldown",
    "pull-ups": "Pull-Up",
    "pullups": "Pull-Up",
    "pull ups": "Pull-Up",
    "t-bar rows": "T-Bar Row",
    "seated cable rows": "Seated Cable Row",
    "cable rows": "Seated Cable Row",
    "cable row": "Seated Cable Row",
    "face pulls": "Face Pull",
    "straight arm pulldowns": "Straight Arm Pulldown",
    "straight-arm pulldown": "Straight Arm Pulldown",
    "dumbbell pullover": "Dumbbell Pullover",
    "dumbbell pullovers": "Dumbbell Pullover",

    // Legs
    "squats": "Barbell Squat",
    "squat": "Barbell Squat",
    "barbell squats": "Barbell Squat",
    "front squats": "Front Squat",
    "deadlifts": "Deadlift",
    "conventional deadlift": "Deadlift",
    "rdl": "Romanian Deadlift",
    "romanian deadlifts": "Romanian Deadlift",
    "stiff leg deadlift": "Romanian Deadlift",
    "standing calf raises": "Standing Calf Raise",
    "calf raises": "Standing Calf Raise",
    "seated calf raises": "Seated Calf Raise",
    "leg extensions": "Leg Extension",
    "lying leg curls": "Leg Curl",
    "leg curls": "Leg Curl",
    "seated leg curls": "Leg Curl",
    "bulgarian split squats": "Bulgarian Split Squat",
    "hip thrusts": "Barbell Hip Thrust",
    "hip thrust": "Barbell Hip Thrust",
    "barbell hip thrusts": "Barbell Hip Thrust",
    "cable kickbacks": "Cable Kickback",
    "cable kickback": "Cable Kickback",
    "walking lunges": "Walking Lunge",
    "walking lunge": "Walking Lunge",
    "lunges": "Walking Lunge",
    "lunge": "Walking Lunge",
    "abduction machine": "Hip Abductor Machine",
    "hip abductors": "Hip Abductor Machine",
    "hip abductor": "Hip Abductor Machine",

    // Shoulders
    "side laterals": "Lateral Raise",
    "lateral raises": "Lateral Raise",
    "front raises": "Front Raise",
    "seated db press": "Seated Dumbbell Press",
    "seated shoulder press": "Seated Dumbbell Press",
    "shoulder press": "Overhead Press",
    "dumbbell shrugs": "Dumbbell Shrug",

    // Arms
    "bicep curls": "Dumbbell Curl",
    "barbell bicep curls": "Barbell Curl",
    "db curls": "Dumbbell Curl",
    "barbell curls": "Barbell Curl",
    "hammer curls": "Hammer Curl",
    "preacher curls": "Preacher Curl",
    "concentration curls": "Concentration Curl",
    "triceps pushdown": "Tricep Pushdown",
    "tricep pushdowns": "Tricep Pushdown",
    "cable tricep pushdowns": "Tricep Pushdown",
    "skull crushers": "Skull Crusher",
    "skullcrushers": "Skull Crusher",
    "overhead tricep ext": "Overhead Tricep Extension",

    // Assorted corrections
    "dumbell curl": "Dumbbell Curl",
    "dumbbell curls": "Dumbbell Curl",
    "dumbell row": "Dumbbell Row",
};

export function resolveCanonicalExercise(inputName: string): CanonicalExercise | null {
    if (!inputName) return null;
    const lowerInput = inputName.trim().toLowerCase();

    // 1. Direct match
    const directMatch = CANONICAL_EXERCISES.find(e => e.canonical_name.toLowerCase() === lowerInput);
    if (directMatch) return directMatch;

    // 2. Alias match
    const aliasMatch = EXERCISE_ALIASES[lowerInput];
    if (aliasMatch) {
        const canonicalMatch = CANONICAL_EXERCISES.find(e => e.canonical_name === aliasMatch);
        if (canonicalMatch) return canonicalMatch;
    }

    return null;
}
