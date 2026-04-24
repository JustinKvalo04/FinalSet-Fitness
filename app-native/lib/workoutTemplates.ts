export type ExerciseTemplate = {
    id: string;
    name: string;
    sets: number;
    reps: string;
    notes?: string;
};

export type WorkoutDayTemplate = {
    id: string;
    name: string;
    target: string;
    exercises: ExerciseTemplate[];
};

export type ExerciseOverride = {
    exercise_id: string;
    sets: number;
    reps: string;
};

export type CustomWorkoutOverrides = {
    [workoutDayId: string]: ExerciseOverride[];
};

export type WorkoutSplit = {
    id: string;
    name: string;
    description: string;
    days: WorkoutDayTemplate[];
};

export function resolveWorkoutDay(
    dayId: string,
    dayTemplate: WorkoutDayTemplate,
    profileOverrides?: CustomWorkoutOverrides | null
): WorkoutDayTemplate {
    if (!profileOverrides) return dayTemplate;
    const dayOverrides = profileOverrides[dayId];
    if (!dayOverrides || dayOverrides.length === 0) return dayTemplate;

    const resolvedExercises: ExerciseTemplate[] = dayOverrides.map((override, index) => ({
        id: override.exercise_id + '-' + index,
        name: override.exercise_id,
        sets: override.sets,
        reps: override.reps
    }));

    return {
        ...dayTemplate,
        exercises: resolvedExercises
    };
}

export const WORKOUT_SPLITS: WorkoutSplit[] = [
    {
        id: 'split-1',
        name: 'Push / Pull / Legs (PPL)',
        description: 'A classic 3-6 day split focusing on movement patterns. Great for hypertrophy.',
        days: [
            {
                id: 'ppl-push',
                name: 'Push Day',
                target: 'Chest, Shoulders, Triceps',
                exercises: [
                    { id: '1', name: 'Barbell Bench Press', sets: 4, reps: '6-8' },
                    { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '8-10' },
                    { id: '3', name: 'Seated Shoulder Press', sets: 3, reps: '8-10' },
                    { id: '4', name: 'Lateral Raises', sets: 4, reps: '12-15', notes: 'Focus on slow eccentric' },
                    { id: '5', name: 'Cable Tricep Pushdowns', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'ppl-pull',
                name: 'Pull Day',
                target: 'Back, Biceps, Rear Delts',
                exercises: [
                    { id: '6', name: 'Barbell Rows', sets: 4, reps: '6-8' },
                    { id: '7', name: 'Lat Pulldowns', sets: 3, reps: '8-12' },
                    { id: '8', name: 'Face Pulls', sets: 3, reps: '12-15' },
                    { id: '9', name: 'Barbell Bicep Curls', sets: 3, reps: '8-10' },
                    { id: '10', name: 'Hammer Curls', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'ppl-legs',
                name: 'Leg Day',
                target: 'Quads, Hamstrings, Calves',
                exercises: [
                    { id: '11', name: 'Barbell Squats', sets: 4, reps: '5-8' },
                    { id: '12', name: 'Romanian Deadlifts', sets: 3, reps: '8-10', notes: 'Hinge at the hips' },
                    { id: '13', name: 'Leg Press', sets: 3, reps: '10-12' },
                    { id: '14', name: 'Leg Extensions', sets: 3, reps: '12-15' },
                    { id: '15', name: 'Calf Raises', sets: 4, reps: '15-20' },
                ]
            }
        ]
    },
    {
        id: 'split-2',
        name: 'Upper / Lower',
        description: 'Hits every muscle group twice a week. Excellent for both strength and size.',
        days: [
            {
                id: 'ul-upper',
                name: 'Upper Body',
                target: 'Chest, Back, Shoulders, Arms',
                exercises: [
                    { id: '21', name: 'Bench Press', sets: 4, reps: '6-8' },
                    { id: '22', name: 'Pull-Ups', sets: 4, reps: 'AMRAP' },
                    { id: '23', name: 'Overhead Press', sets: 3, reps: '8-10' },
                    { id: '24', name: 'Seated Cable Rows', sets: 3, reps: '10-12' },
                    { id: '25', name: 'Dumbbell Curls', sets: 3, reps: '10-12' },
                    { id: '26', name: 'Skull Crushers', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'ul-lower',
                name: 'Lower Body',
                target: 'Legs & Core',
                exercises: [
                    { id: '27', name: 'Squats', sets: 4, reps: '6-8' },
                    { id: '28', name: 'Deadlifts', sets: 3, reps: '5' },
                    { id: '29', name: 'Bulgarian Split Squats', sets: 3, reps: '8-10' },
                    { id: '30', name: 'Lying Leg Curls', sets: 3, reps: '10-12' },
                    { id: '31', name: 'Standing Calf Raises', sets: 4, reps: '12-15' },
                ]
            }
        ]
    },
    {
        id: 'split-3',
        name: 'The Arnold Split',
        description: 'Chest/Back, Shoulders/Arms, Legs. A high-volume staple of golden era bodybuilding.',
        days: [
            {
                id: 'arnold-cb',
                name: 'Chest & Back',
                target: 'Pecs, Lats, Mid-Back',
                exercises: [
                    { id: '41', name: 'Bench Press', sets: 4, reps: '8-10' },
                    { id: '42', name: 'Incline Dumbbell Press', sets: 3, reps: '8-10' },
                    { id: '43', name: 'Bent Over Rows', sets: 4, reps: '8-10' },
                    { id: '44', name: 'Pull-Ups', sets: 3, reps: '8-10' },
                    { id: '45', name: 'Dumbbell Pullovers', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'arnold-sa',
                name: 'Shoulders & Arms',
                target: 'Deltoids, Biceps, Triceps',
                exercises: [
                    { id: '46', name: 'Seated Dumbbell Press', sets: 4, reps: '8-10' },
                    { id: '47', name: 'Lateral Raises', sets: 4, reps: '10-12' },
                    { id: '48', name: 'Barbell Curls', sets: 4, reps: '8-10' },
                    { id: '49', name: 'Overhead Tricep Extension', sets: 4, reps: '8-10' },
                    { id: '50', name: 'Concentration Curls', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'arnold-legs',
                name: 'Legs',
                target: 'Quads, Hamstrings, Calves',
                exercises: [
                    { id: '51', name: 'Front Squats', sets: 4, reps: '8-10' },
                    { id: '52', name: 'Leg Press', sets: 4, reps: '10-12' },
                    { id: '53', name: 'Leg Extensions', sets: 3, reps: '12-15' },
                    { id: '54', name: 'Lying Leg Curls', sets: 3, reps: '12-15' },
                    { id: '55', name: 'Seated Calf Raises', sets: 4, reps: '15-20' },
                ]
            }
        ]
    },
    {
        id: 'split-4',
        name: 'Full Body',
        description: 'Hits major muscle groups every session. Best for 3 days a week.',
        days: [
            {
                id: 'fb-day1',
                name: 'Full Body Workout A',
                target: 'Entire Body',
                exercises: [
                    { id: '61', name: 'Squats', sets: 3, reps: '5-8' },
                    { id: '62', name: 'Bench Press', sets: 3, reps: '5-8' },
                    { id: '63', name: 'Barbell Rows', sets: 3, reps: '8-10' },
                    { id: '64', name: 'Overhead Press', sets: 3, reps: '8-10' },
                    { id: '65', name: 'Calf Raises', sets: 3, reps: '12-15' },
                ]
            },
            {
                id: 'fb-day2',
                name: 'Full Body Workout B',
                target: 'Entire Body',
                exercises: [
                    { id: '66', name: 'Deadlifts', sets: 3, reps: '5' },
                    { id: '67', name: 'Pull-Ups', sets: 3, reps: 'AMRAP' },
                    { id: '68', name: 'Incline Dumbbell Press', sets: 3, reps: '8-10' },
                    { id: '69', name: 'Leg Press', sets: 3, reps: '10-12' },
                    { id: '70', name: 'Face Pulls', sets: 3, reps: '12-15' },
                ]
            }
        ]
    },
    {
        id: 'split-5',
        name: 'The Bro Split',
        description: 'Dedicate an entire day to a single muscle group. For advanced mind-muscle connection.',
        days: [
            {
                id: 'bro-chest',
                name: 'Chest Day',
                target: 'Pectorals',
                exercises: [
                    { id: '81', name: 'Flat Bench Press', sets: 4, reps: '8-10' },
                    { id: '82', name: 'Incline Dumbbell Press', sets: 4, reps: '8-10' },
                    { id: '83', name: 'Cable Crossovers', sets: 4, reps: '10-12' },
                    { id: '84', name: 'Pec Deck Machine', sets: 3, reps: '12-15' },
                ]
            },
            {
                id: 'bro-back',
                name: 'Back Day',
                target: 'Lats, Rhomboids, Traps',
                exercises: [
                    { id: '85', name: 'Deadlifts', sets: 4, reps: '5-8' },
                    { id: '86', name: 'Lat Pulldowns', sets: 4, reps: '8-10' },
                    { id: '87', name: 'T-Bar Rows', sets: 4, reps: '8-10' },
                    { id: '88', name: 'Dumbbell Rows', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'bro-arms',
                name: 'Arm Day',
                target: 'Biceps & Triceps',
                exercises: [
                    { id: '89', name: 'Barbell Curls', sets: 4, reps: '10' },
                    { id: '90', name: 'Skull Crushers', sets: 4, reps: '10' },
                    { id: '91', name: 'Preacher Curls', sets: 3, reps: '12' },
                    { id: '92', name: 'Tricep Pushdowns', sets: 3, reps: '12' },
                    { id: '93', name: 'Hammer Curls', sets: 3, reps: '12' },
                ]
            },
            {
                id: 'bro-shoulders',
                name: 'Shoulder Day',
                target: 'Delts & Traps',
                exercises: [
                    { id: '94', name: 'Overhead Press', sets: 4, reps: '8-10' },
                    { id: '95', name: 'Lateral Raises', sets: 4, reps: '12-15', notes: 'Very strict form' },
                    { id: '96', name: 'Front Raises', sets: 3, reps: '10-12' },
                    { id: '97', name: 'Reverse Pec Deck', sets: 4, reps: '12-15' },
                    { id: '98', name: 'Dumbbell Shrugs', sets: 4, reps: '10-12' },
                ]
            },
            {
                id: 'bro-legs',
                name: 'Leg Day',
                target: 'Lower Body',
                exercises: [
                    { id: '99', name: 'Squats', sets: 4, reps: '8-10' },
                    { id: '100', name: 'Leg Press', sets: 4, reps: '10-12' },
                    { id: '101', name: 'Leg Extensions', sets: 4, reps: '12-15' },
                    { id: '102', name: 'Lying Leg Curls', sets: 4, reps: '10-12' },
                    { id: '103', name: 'Calf Raises', sets: 5, reps: '15-20' },
                ]
            }
        ]
    },
    {
        id: 'split-6',
        name: 'Powerbuilding',
        description: 'Combines the Big 3 power lifts for strength with bodybuilding accessories for size.',
        days: [
            {
                id: 'pb-squat',
                name: 'Squat Focus',
                target: 'Quads & Strength',
                exercises: [
                    { id: '111', name: 'Squats', sets: 5, reps: '3-5', notes: 'Heavy' },
                    { id: '112', name: 'Leg Press', sets: 4, reps: '8-10' },
                    { id: '113', name: 'Leg Extensions', sets: 3, reps: '12-15' },
                    { id: '114', name: 'Calf Raises', sets: 4, reps: '15' },
                ]
            },
            {
                id: 'pb-bench',
                name: 'Bench Focus',
                target: 'Chest & Strength',
                exercises: [
                    { id: '115', name: 'Bench Press', sets: 5, reps: '3-5', notes: 'Heavy, pause on chest' },
                    { id: '116', name: 'Incline Dumbbell Press', sets: 4, reps: '8-10' },
                    { id: '117', name: 'Pec Deck', sets: 3, reps: '12-15' },
                    { id: '118', name: 'Overhead Tricep Ext', sets: 3, reps: '10-12' },
                ]
            },
            {
                id: 'pb-deadlift',
                name: 'Deadlift Focus',
                target: 'Back & Posterior Chain',
                exercises: [
                    { id: '119', name: 'Deadlifts', sets: 5, reps: '3-5', notes: 'Heavy' },
                    { id: '120', name: 'Barbell Rows', sets: 4, reps: '8-10' },
                    { id: '121', name: 'Lat Pulldowns', sets: 3, reps: '10-12' },
                    { id: '122', name: 'Bicep Curls', sets: 3, reps: '10-12' },
                ]
            }
        ]
    },
    {
        id: 'split-7',
        name: 'Strength Focused (5x5)',
        description: 'Pure strength progression. Heavy weights, lower volume, maximal force.',
        days: [
            {
                id: '5x5-a',
                name: 'Workout A',
                target: 'Squat, Bench, Row',
                exercises: [
                    { id: '131', name: 'Squats', sets: 5, reps: '5', notes: 'Add 5lbs each session' },
                    { id: '132', name: 'Bench Press', sets: 5, reps: '5' },
                    { id: '133', name: 'Barbell Rows', sets: 5, reps: '5' },
                ]
            },
            {
                id: '5x5-b',
                name: 'Workout B',
                target: 'Squat, Press, Deadlift',
                exercises: [
                    { id: '134', name: 'Squats', sets: 5, reps: '5' },
                    { id: '135', name: 'Overhead Press', sets: 5, reps: '5' },
                    { id: '136', name: 'Deadlift', sets: 1, reps: '5', notes: '1 heavy working set' },
                ]
            }
        ]
    },
    {
        id: 'split-8',
        name: 'Lower Body Focus',
        description: 'Emphasizes lower body development with balanced upper training.',
        days: [
            {
                id: 'lb-1',
                name: 'Lower (Glute/Ham)',
                target: 'Glutes, Hamstrings, Calves',
                exercises: [
                    { id: '141', name: 'Barbell Hip Thrust', sets: 4, reps: '8-10', notes: 'Squeeze glutes at top' },
                    { id: '142', name: 'Romanian Deadlift', sets: 4, reps: '8-10' },
                    { id: '143', name: 'Bulgarian Split Squat', sets: 3, reps: '10-12' },
                    { id: '144', name: 'Cable Kickbacks', sets: 3, reps: '12-15' },
                    { id: '145', name: 'Leg Curl', sets: 4, reps: '12-15' },
                ]
            },
            {
                id: 'ub-1',
                name: 'Upper (Push/Pull)',
                target: 'Chest, Back, Arms',
                exercises: [
                    { id: '146', name: 'Bench Press', sets: 4, reps: '8-10' },
                    { id: '147', name: 'Barbell Row', sets: 4, reps: '8-10' },
                    { id: '148', name: 'Overhead Press', sets: 3, reps: '10-12' },
                    { id: '149', name: 'Lat Pulldown', sets: 3, reps: '10-12' },
                    { id: '150', name: 'Bicep Curls', sets: 3, reps: '12-15' },
                    { id: '151', name: 'Triceps Pushdown', sets: 3, reps: '12-15' },
                ]
            },
            {
                id: 'lb-2',
                name: 'Lower (Quad Focus)',
                target: 'Quads, Calves',
                exercises: [
                    { id: '152', name: 'Barbell Squat', sets: 4, reps: '8-10' },
                    { id: '153', name: 'Walking Lunges', sets: 3, reps: '10-12' },
                    { id: '154', name: 'Leg Extension', sets: 4, reps: '12-15' },
                    { id: '155', name: 'Barbell Hip Thrust', sets: 3, reps: '12-15', notes: 'Lighter weight, constant tension' },
                    { id: '156', name: 'Hip Abductor Machine', sets: 4, reps: '15-20' },
                ]
            },
            {
                id: 'ub-2',
                name: 'Upper (Lighter)',
                target: 'Shoulders, Arms, Core',
                exercises: [
                    { id: '157', name: 'Seated Dumbbell Press', sets: 3, reps: '10-12' },
                    { id: '158', name: 'Lateral Raise', sets: 4, reps: '12-15' },
                    { id: '159', name: 'Dumbbell Row', sets: 3, reps: '10-12' },
                    { id: '160', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
                    { id: '161', name: 'Hammer Curl', sets: 3, reps: '12-15' },
                    { id: '162', name: 'Cable Crunch', sets: 3, reps: '15-20' },
                ]
            }
        ]
    }
];
