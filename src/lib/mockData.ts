import { RiddleQuestion } from "../types/gameTypes";

export const MOCK_RIDDLES: RiddleQuestion[] = [
    {
        id: "1",
        difficulty: "Easy",
        topic: "Technology",
        riddle: "I have keys but no locks. I have a space but no room. You can enter, but never go outside. What am I?",
        correctAnswer: "Keyboard",
        options: [
            { id: "opt1", text: "Piano", isCorrect: false },
            { id: "opt2", text: "Keyboard", isCorrect: true },
            { id: "opt3", text: "Door", isCorrect: false }
        ],
        hints: [
            "I am essential for typing.",
            "I am found on every laptop.",
            "I have a 'Space' bar."
        ]
    },
    {
        id: "2",
        difficulty: "Medium",
        topic: "Science",
        riddle: "I am the invisible force that keeps your feet on the ground, yet I am weak enough to be overcome by a magnet. What am I?",
        correctAnswer: "Gravity",
        options: [
            { id: "opt1", text: "Magnetism", isCorrect: false },
            { id: "opt2", text: "Friction", isCorrect: false },
            { id: "opt3", text: "Gravity", isCorrect: true }
        ],
        hints: [
            "Isaac Newton correlates with me.",
            "I pull everything towards the center of the Earth.",
            "I am not a tangible object."
        ]
    },
    {
        id: "3",
        difficulty: "Hard",
        topic: "Philosophy",
        riddle: "I am the beginning of eternity, the end of time and space, the beginning of every end, and the end of every place. What am I?",
        correctAnswer: "The Letter E",
        options: [
            { id: "opt1", text: "Time", isCorrect: false },
            { id: "opt2", text: "The Letter E", isCorrect: true },
            { id: "opt3", text: "Nothing", isCorrect: false }
        ],
        hints: [
            "Look at the spelling of the words.",
            "I appear in 'Eternity' and 'End'.",
            "I am a vowel."
        ]
    },
    {
        id: "4",
        difficulty: "Easy",
        topic: "Nature",
        riddle: "I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I?",
        correctAnswer: "Cloud",
        options: [
            { id: "opt1", text: "Cloud", isCorrect: true },
            { id: "opt2", text: "Bat", isCorrect: false },
            { id: "opt3", text: "Ghost", isCorrect: false }
        ],
        hints: [
            "I float in the sky.",
            "I bring rain.",
            "I can block the sun."
        ]
    },
    {
        id: "5",
        difficulty: "Medium",
        topic: "Computer Science",
        riddle: "I am a logic gate. I only return true if both my inputs are true. What am I?",
        correctAnswer: "AND Gate",
        options: [
            { id: "opt1", text: "OR Gate", isCorrect: false },
            { id: "opt2", text: "XOR Gate", isCorrect: false },
            { id: "opt3", text: "AND Gate", isCorrect: true }
        ],
        hints: [
            "I am strict about my conditions.",
            "1 + 1 = 1, but 1 + 0 = 0.",
            "Both must be present."
        ]
    },
    {
        id: "6",
        difficulty: "Hard",
        topic: "Abstract",
        riddle: "The more you take, the more you leave behind. What am I?",
        correctAnswer: "Footsteps",
        options: [
            { id: "opt1", text: "Time", isCorrect: false },
            { id: "opt2", text: "Memories", isCorrect: false },
            { id: "opt3", text: "Footsteps", isCorrect: true }
        ],
        hints: [
            "You make me when you walk.",
            "I appear on sand clearly.",
            "I mark your path."
        ]
    },
    {
        id: "7",
        difficulty: "Easy",
        topic: "Household",
        riddle: "I have a neck but no head. I have two arms but no hands. I'm with you to school, work, and play. What am I?",
        correctAnswer: "Shirt",
        options: [
            { id: "opt1", text: "Sweater", isCorrect: false },
            { id: "opt2", text: "Shirt", isCorrect: true },
            { id: "opt3", text: "Bag", isCorrect: false }
        ],
        hints: [
            "You wear me.",
            "I have buttons usually.",
            "I have sleeves."
        ]
    },
    {
        id: "8",
        difficulty: "Medium",
        topic: "Geography",
        riddle: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        correctAnswer: "Map",
        options: [
            { id: "opt1", text: "Map", isCorrect: true },
            { id: "opt2", text: "Desert", isCorrect: false },
            { id: "opt3", text: "Globe", isCorrect: false }
        ],
        hints: [
            "I guide you on your travels.",
            "I can be folded or digital.",
            "I represent the world on paper."
        ]
    },
    {
        id: "9",
        difficulty: "Hard",
        topic: "Linguistics",
        riddle: "What 5-letter word becomes shorter when you add two letters to it?",
        correctAnswer: "Short",
        options: [
            { id: "opt1", text: "Small", isCorrect: false },
            { id: "opt2", text: "Short", isCorrect: true },
            { id: "opt3", text: "Brief", isCorrect: false }
        ],
        hints: [
            "It's a paradox of language.",
            "The answer is in the riddle itself.",
            "If you add 'er' to me, I mean the same."
        ]
    },
    {
        id: "10",
        difficulty: "Easy",
        topic: "Food",
        riddle: "I am a fruit. I am yellow and curved. Monkeys love me. What am I?",
        correctAnswer: "Banana",
        options: [
            { id: "opt1", text: "Lemon", isCorrect: false },
            { id: "opt2", text: "Banana", isCorrect: true },
            { id: "opt3", text: "Corn", isCorrect: false }
        ],
        hints: [
            "I have a peel.",
            "I am high in potassium.",
            "I grow in bunches."
        ]
    }
];

export const MOCK_CONTEXT_CHALLENGES: RiddleQuestion[] = [
    {
        id: "cc_1",
        difficulty: "Easy",
        topic: "General",
        riddle: "Serendipity",
        correctAnswer: "Finding something good without looking for it",
        options: [
            { id: "opt1", text: "A feeling of deep sadness without cause", isCorrect: false },
            { id: "opt2", text: "Finding something good without looking for it", isCorrect: true },
            { id: "opt3", text: "The ability to stay calm in chaos", isCorrect: false }
        ],
        hints: [
            "It involves luck and happy accidents.",
            "Penicillin was discovered this way.",
            "It's a pleasant surprise."
        ]
    },
    {
        id: "cc_2",
        difficulty: "Medium",
        topic: "Science",
        riddle: "Entropy",
        correctAnswer: "A measure of disorder or randomness in a system",
        options: [
            { id: "opt1", text: "A measure of disorder or randomness in a system", isCorrect: true },
            { id: "opt2", text: "The speed at which light travels in a vacuum", isCorrect: false },
            { id: "opt3", text: "A chemical reaction that releases heat", isCorrect: false }
        ],
        hints: [
            "It always increases in an isolated system.",
            "It is related to the Second Law of Thermodynamics.",
            "Think of a messy room getting messier."
        ]
    },
    {
        id: "cc_3",
        difficulty: "Hard",
        topic: "Philosophy",
        riddle: "Epistemology",
        correctAnswer: "The study of the nature, origin, and limits of human knowledge",
        options: [
            { id: "opt1", text: "The study of the nature, origin, and limits of human knowledge", isCorrect: true },
            { id: "opt2", text: "The study of moral values and rules", isCorrect: false },
            { id: "opt3", text: "The study of existence and reality", isCorrect: false }
        ],
        hints: [
            "It asks 'How do we know what we know?'.",
            "It distinguishes justified belief from opinion.",
            "It comes from the Greek word for 'knowledge'."
        ]
    },
    {
        id: "cc_4",
        difficulty: "Medium",
        topic: "Literature",
        riddle: "Juxtaposition",
        correctAnswer: "Placing two things close together with contrasting effect",
        options: [
            { id: "opt1", text: "A figure of speech involving exaggeration", isCorrect: false },
            { id: "opt2", text: "Placing two things close together with contrasting effect", isCorrect: true },
            { id: "opt3", text: "The repetition of initial consonant sounds", isCorrect: false }
        ],
        hints: [
            "Think of light and dark side by side.",
            "It highlights differences.",
            "Used often in photography and poetry."
        ]
    },
    {
        id: "cc_5",
        difficulty: "Easy",
        topic: "Technology",
        riddle: "Algorithm",
        correctAnswer: "A process or set of rules to be followed in calculations",
        options: [
            { id: "opt1", text: "A physical component of a computer", isCorrect: false },
            { id: "opt2", text: "A type of computer virus", isCorrect: false },
            { id: "opt3", text: "A process or set of rules to be followed in calculations", isCorrect: true }
        ],
        hints: [
            "It's like a recipe for a computer.",
            "Search engines use it to rank results.",
            "It solves a problem step-by-step."
        ]
    }
];

