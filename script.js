
"use strict";

// ==========================================
// EDITH - MAIN JAVASCRIPT
// ==========================================

let selectedMode = "";
let selectedSubject = "";
let selectedChapter = "";
let selectedTopic = "";

const QUESTION_STORAGE_KEY = "edithQuestions";
const ADMIN_CODE = "IIM indore";

// Practice variables
let practiceQuestions = [];
let currentPracticeIndex = 0;
let practiceScore = 0;
let selectedPracticeAnswer = "";
let practiceAnswered = false;
let practiceReturnScreen = "topic-screen";

// ==========================================
// SUBJECT CHAPTERS AND TOPICS
// ==========================================

const subjectChapters = {
    "Quantitative Aptitude": {
        "Arithmetic": [
            "Percentages",
            "Profit, Loss, and Discount",
            "Ratio and Proportion",
            "Averages and Mixtures/Alligations",
            "Simple and Compound Interest",
            "Time and Work",
            "Pipes and Cisterns",
            "Time, Speed, and Distance",
            "Trains",
            "Boats and Streams",
            "Circular Tracks",
            "Races"
        ],
        "Algebra": [
            "Algebraic Formulae and Identities",
            "Linear and Quadratic Equations",
            "Inequalities and Modulus Inequalities",
            "Logarithms",
            "Functions and Graphs",
            "Progressions (AP, GP, HP)"
        ],
        "Number System": [
            "Types of Numbers",
            "Divisibility Rules and Remainders",
            "Factors, Multiples, HCF, and LCM",
            "Unit Digit Problems",
            "Base Systems"
        ],
        "Geometry and Mensuration": [
            "Basics of Geometry",
            "Circles",
            "Coordinate Geometry",
            "Mensuration of 2D and 3D Solids"
        ],
        "Higher Mathematics / Modern Math": [
            "Permutation and Combination",
            "Probability",
            "Set Theory",
            "Calculus / Basic Functions",
            "Data Interpretation and Logical Reasoning"
        ]
    },

    "Verbal Ability": {
        "Vocabulary": [
            "Synonyms",
            "Antonyms",
            "Word Usage",
            "One Word Substitution",
            "Idioms and Phrases"
        ],
        "Grammar": [
            "Parts of Speech",
            "Tenses",
            "Subject-Verb Agreement",
            "Articles and Prepositions",
            "Sentence Correction",
            "Error Spotting"
        ],
        "Sentence Skills": [
            "Sentence Completion",
            "Para Completion",
            "Sentence Improvement"
        ],
        "Para Jumbles": [
            "Sentence Arrangement",
            "Paragraph Arrangement"
        ]
    },

    "Logical Reasoning": {
        "Analytical Reasoning": [
            "Seating Arrangements",
            "Linear Arrangements",
            "Circular Arrangements",
            "Puzzles",
            "Ordering and Ranking"
        ],
        "Logical Reasoning": [
            "Blood Relations",
            "Direction Sense",
            "Coding-Decoding",
            "Syllogisms",
            "Statement and Conclusion",
            "Statement and Assumption",
            "Arguments"
        ],
        "Series and Patterns": [
            "Number Series",
            "Letter Series",
            "Alphanumeric Series",
            "Analogy",
            "Classification"
        ],
        "Other Reasoning": [
            "Clocks",
            "Calendars",
            "Venn Diagrams",
            "Cubes and Dice"
        ]
    },

    "Data Interpretation and Logical Reasoning": {
        "Tables and Charts": [
            "Tables",
            "Bar Graphs",
            "Line Graphs",
            "Pie Charts",
            "Mixed Graphs"
        ],
        "Caselets and Data Sets": [
            "Caselets",
            "Data-Based Sets",
            "Missing Data"
        ],
        "Data Reasoning": [
            "Data Sufficiency",
            "Venn Diagrams",
            "Arrangement-Based Sets",
            "Logical Data Sets"
        ]
    }
};

// ==========================================
// SCREEN NAVIGATION
// ==========================================

const screenIds = [
    "home-screen",
    "subject-screen",
    "chapter-screen",
    "topic-screen",
    "rc-screen",
    "mock-screen",
    "settings-screen",
    "admin-login-screen",
    "question-manager-screen",
    "practice-screen"
];

function showScreen(id) {
    screenIds.forEach(function(screenId) {
        const screen = document.getElementById(screenId);

        if (screen) {
            screen.style.display =
                screenId === id ? "block" : "none";
        }
    });
}

function hideAllScreens() {
    screenIds.forEach(function(id) {
        const screen = document.getElementById(id);

        if (screen) {
            screen.style.display = "none";
        }
    });
}

// ==========================================
// HOME AND SECTION NAVIGATION
// ==========================================

function goHome() {
    showScreen("home-screen");
}

function openSection(mode) {
    selectedMode = mode;

    if (mode === "Mock Tests") {
        showScreen("mock-screen");
        return;
    }

    showScreen("subject-screen");

    const heading = document.getElementById("mode-title");

    if (heading) {
        heading.textContent = mode + " - Choose Your Subject";
    }
}

// ==========================================
// SUBJECT AND CHAPTER NAVIGATION
// ==========================================

function openChapters(subject) {
    selectedSubject = subject;
    selectedChapter = "";
    selectedTopic = "";

    if (
        subject.toLowerCase() === "reading comprehension" ||
        subject.toLowerCase() === "rc"
    ) {
        openRCPractice();
        return;
    }

    const chapters = subjectChapters[subject];

    if (!chapters) {
        alert("Chapters for this subject are not available.");
        return;
    }

    const chapterList = document.getElementById("chapter-list");
    const heading = document.getElementById("chapter-heading");

    if (!chapterList || !heading) {
        alert("Chapter screen is missing. Check index.html.");
        return;
    }

    chapterList.innerHTML = "";
    heading.textContent = subject + " - Choose a Chapter";

    Object.keys(chapters).forEach(function(chapter, index) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent =
            String(index + 1).padStart(2, "0") + ". " + chapter;

        button.addEventListener("click", function() {
            openChapter(chapter);
        });

        chapterList.appendChild(button);
    });

    showScreen("chapter-screen");
}

function backToSubjects() {
    showScreen("subject-screen");
}

function openChapter(chapter) {
    selectedChapter = chapter;

    const chapters = subjectChapters[selectedSubject];
    const topics = chapters ? chapters[chapter] : null;

    if (!topics) {
        alert("Topics for this chapter are not available.");
        return;
    }

    const topicList = document.getElementById("topic-list");
    const heading = document.getElementById("topic-heading");

    if (!topicList || !heading) {
        alert("Topic screen is missing. Check index.html.");
        return;
    }

    topicList.innerHTML = "";
    heading.textContent = chapter + " - Choose a Topic";

    topics.forEach(function(topic, index) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent =
            String(index + 1).padStart(2, "0") + ". " + topic;

        button.addEventListener("click", function() {
            openTopic(topic);
        });

        topicList.appendChild(button);
    });

    showScreen("topic-screen");
}

function backToChapters() {
    openChapters(selectedSubject);
}

function openTopic(topic) {
    selectedTopic = topic;
    practiceReturnScreen = "topic-screen";
    startPractice();
}

// ==========================================
// READING COMPREHENSION
// ==========================================

function openRCPractice() {
    selectedSubject = "Reading Comprehension";
    selectedChapter = "";
    selectedTopic = "";
    practiceReturnScreen = "subject-screen";

    startPractice();
}

// ==========================================
// MOCK TESTS
// ==========================================

function startMock(subject) {
    selectedSubject = subject;

    alert(
        "EDITH Mock Test\n" +
        "Subject: " + subject +
        "\nMock test feature will be added soon."
    );
}

// ==========================================
// SETTINGS AND ADMIN
// ==========================================

function openSettings() {
    showScreen("settings-screen");
}

function openAdminLogin() {
    const pin = document.getElementById("admin-pin");

    if (pin) {
        pin.value = "";
    }

    showScreen("admin-login-screen");
}

function verifyAdmin() {
    const pinInput = document.getElementById("admin-pin");

    if (!pinInput) {
        return;
    }

    if (pinInput.value.trim() === ADMIN_CODE) {
        pinInput.value = "";
        openQuestionManager();
    } else {
        alert("Incorrect Admin Code. Please try again.");
        pinInput.value = "";
    }
}

function openQuestionManager() {
    showScreen("question-manager-screen");
    updateQuestionChapters();
}

// ==========================================
// QUESTION MANAGER
// ==========================================

function updateQuestionChapters() {
    const subjectSelect =
        document.getElementById("question-subject");

    const chapterSelect =
        document.getElementById("question-chapter");

    if (!subjectSelect || !chapterSelect) {
        return;
    }

    const chapters = subjectChapters[subjectSelect.value];

    chapterSelect.innerHTML = "";

    if (!chapters) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No chapter required";
        chapterSelect.appendChild(option);
        return;
    }

    Object.keys(chapters).forEach(function(chapter) {
        const option = document.createElement("option");

        option.value = chapter;
        option.textContent = chapter;

        chapterSelect.appendChild(option);
    });
}

// ==========================================
// QUESTION STORAGE
// ==========================================

function getSavedQuestions() {
    try {
        const savedData =
            localStorage.getItem(QUESTION_STORAGE_KEY);

        if (!savedData) {
            return [];
        }

        const questions = JSON.parse(savedData);

        return Array.isArray(questions) ? questions : [];

    } catch (error) {
        console.error("Question storage error:", error);
        return [];
    }
}

function saveQuestion() {
    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    const mode = getValue("question-mode");
    const subject = getValue("question-subject");
    const chapter = getValue("question-chapter");
    const topic = getValue("question-topic");
    const questionText = getValue("question-text");

    const correctAnswer =
        getValue("correct-answer").toUpperCase();

    const explanation = getValue("question-explanation");

    const options = {
        A: getValue("option-a"),
        B: getValue("option-b"),
        C: getValue("option-c"),
        D: getValue("option-d")
    };

    const isRC =
        subject.toLowerCase() === "reading comprehension" ||
        subject.toLowerCase() === "rc";

    if (
        (!topic && !isRC) ||
        !questionText ||
        !options.A ||
        !options.B ||
        !options.C ||
        !options.D ||
        !["A", "B", "C", "D"].includes(correctAnswer) ||
        !explanation
    ) {
        alert("Please complete all question fields and select a valid correct answer.");
        return;
    }

    const newQuestion = {
        id: Date.now().toString(),
        mode: mode,
        subject: subject,
        chapter: chapter,
        topic: topic,
        question: questionText,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation,
        createdAt: new Date().toISOString()
    };

    const questions = getSavedQuestions();
    questions.push(newQuestion);

    try {
        localStorage.setItem(
            QUESTION_STORAGE_KEY,
            JSON.stringify(questions)
        );

        alert(
            "Question saved successfully!\n" +
            "Total saved questions: " + questions.length
        );

        clearQuestionForm();

    } catch (error) {
        alert("Unable to save the question. Browser storage may be full.");
    }
}

function clearQuestionForm() {
    const ids = [
        "question-topic",
        "question-text",
        "option-a",
        "option-b",
        "option-c",
        "option-d",
        "correct-answer",
        "question-explanation"
    ];

    ids.forEach(function(id) {
        const element = document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });
}

// ==========================================
// PRACTICE SCREEN
// ==========================================

function startPractice() {
    const allQuestions = getSavedQuestions();

    let matchingQuestions = allQuestions.filter(function(question) {
        if (!question || !question.question || !question.options) {
            return false;
        }

        const subjectMatches =
            question.subject === selectedSubject ||
            (
                selectedSubject === "Reading Comprehension" &&
                question.subject === "RC"
            );

        const topicMatches =
            !selectedTopic ||
            question.topic === selectedTopic;

        const chapterMatches =
            !selectedChapter ||
            question.chapter === selectedChapter;

        const modeMatches =
            !selectedMode ||
            question.mode === selectedMode;

        return (
            subjectMatches &&
            topicMatches &&
            chapterMatches &&
            modeMatches
        );
    });

    if (matchingQuestions.length === 0) {
        alert(
            "No saved questions were found for this selection.\n\n" +
            "Check the mode, subject, chapter and topic in Question Manager."
        );
        return;
    }

    matchingQuestions.sort(function() {
        return Math.random() - 0.5;
    });

    practiceQuestions = matchingQuestions;
    currentPracticeIndex = 0;
    practiceScore = 0;
    selectedPracticeAnswer = "";
    practiceAnswered = false;

    showScreen("practice-screen");
    displayPracticeQuestion();
}

function displayPracticeQuestion() {
    const question = practiceQuestions[currentPracticeIndex];

    if (!question) {
        finishPractice();
        return;
    }

    const heading = document.getElementById("practice-heading");
    const category = document.getElementById("practice-category");
    const progress = document.getElementById("question-progress");
    const score = document.getElementById("practice-score");
    const progressBar = document.getElementById("practice-progress-bar");
    const questionText = document.getElementById("practice-question");

    const feedback = document.getElementById("practice-feedback");
    const submitButton = document.getElementById("submit-practice-answer");
    const nextButton = document.getElementById("next-practice-question");

    const resultScreen = document.getElementById("practice-result");
    const questionArea = document.getElementById("practice-question-area");

    if (!questionText || !category || !progress || !score) {
        alert("Practice screen elements are missing in index.html.");
        return;
    }

    if (heading) {
        heading.textContent = "EDITH Practice";
    }

    category.textContent =
        selectedSubject +
        (selectedChapter ? " | " + selectedChapter : "") +
        (selectedTopic ? " | " + selectedTopic : "");

    progress.textContent =
        "Question " + (currentPracticeIndex + 1) +
        " of " + practiceQuestions.length;

    score.textContent = "Score: " + practiceScore;

    if (progressBar) {
        progressBar.style.width =
            ((currentPracticeIndex + 1) / practiceQuestions.length * 100) + "%";
    }

    questionText.textContent = question.question;

    const optionButtons =
        document.querySelectorAll(".answer-option");

    optionButtons.forEach(function(button) {
        const option = button.dataset.option;

        button.textContent =
            option + ". " + (question.options[option] || "");

        button.disabled = false;
        button.classList.remove("selected", "correct", "incorrect");
    });

    selectedPracticeAnswer = "";
    practiceAnswered = false;

    if (feedback) {
        feedback.textContent = "";
    }

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.display = "block";
    }

    if (nextButton) {
        nextButton.style.display = "none";
    }

    if (questionArea) {
        questionArea.style.display = "block";
    }

    if (resultScreen) {
        resultScreen.style.display = "none";
    }
}

function selectPracticeAnswer(option) {
    if (
        practiceAnswered ||
        !["A", "B", "C", "D"].includes(option)
    ) {
        return;
    }

    selectedPracticeAnswer = option;

    document.querySelectorAll(".answer-option").forEach(function(button) {
        button.classList.toggle(
            "selected",
            button.dataset.option === option
        );
    });
}

function submitPracticeAnswer() {
    if (practiceAnswered) {
        return;
    }

    if (!selectedPracticeAnswer) {
        alert("Please select an option first.");
        return;
    }

    const question = practiceQuestions[currentPracticeIndex];

    if (!question) {
        return;
    }

    practiceAnswered = true;

    const correctAnswer =
        String(question.correctAnswer || "").toUpperCase();

    const isCorrect =
        selectedPracticeAnswer === correctAnswer;

    if (isCorrect) {
        practiceScore++;
    }

    document.querySelectorAll(".answer-option").forEach(function(button) {
        button.disabled = true;

        if (button.dataset.option === correctAnswer) {
            button.classList.add("correct");
        } else if (button.dataset.option === selectedPracticeAnswer) {
            button.classList.add("incorrect");
        }
    });

    const feedback =
        document.getElementById("practice-feedback");

    const submitButton =
        document.getElementById("submit-practice-answer");

    const nextButton =
        document.getElementById("next-practice-question");

    const score =
        document.getElementById("practice-score");

    if (feedback) {
        feedback.textContent =
            (isCorrect
                ? "Correct!"
                : "Incorrect. Correct answer: " + correctAnswer + ".") +
            "\n\nExplanation: " + question.explanation;
    }

    if (score) {
        score.textContent = "Score: " + practiceScore;
    }

    if (submitButton) {
        submitButton.style.display = "none";
    }

    if (nextButton) {
        nextButton.style.display = "block";

        nextButton.textContent =
            currentPracticeIndex === practiceQuestions.length - 1
                ? "View Results"
                : "Next Question";
    }
}

function nextPracticeQuestion() {
    if (!practiceAnswered) {
        alert("Please submit your answer first.");
        return;
    }

    currentPracticeIndex++;

    if (currentPracticeIndex >= practiceQuestions.length) {
        finishPractice();
    } else {
        displayPracticeQuestion();
    }
}

function finishPractice() {
    const questionArea =
        document.getElementById("practice-question-area");

    const resultScreen =
        document.getElementById("practice-result");

    const finalScore =
        document.getElementById("final-practice-score");

    const finalMessage =
        document.getElementById("final-practice-message");

    if (questionArea) {
        questionArea.style.display = "none";
    }

    if (resultScreen) {
        resultScreen.style.display = "block";
    }

    if (finalScore) {
        finalScore.textContent =
            "Your score: " + practiceScore +
            " / " + practiceQuestions.length;
    }

    if (finalMessage) {
        const percentage = practiceQuestions.length
            ? Math.round(
                practiceScore / practiceQuestions.length * 100
            )
            : 0;

        if (percentage === 100) {
            finalMessage.textContent =
                "Excellent! You answered every question correctly.";
        } else if (percentage >= 70) {
            finalMessage.textContent =
                "Good work! Keep practising to improve further.";
        } else if (percentage >= 40) {
            finalMessage.textContent =
                "Good attempt. Review the explanations and try again.";
        } else {
            finalMessage.textContent =
                "Keep learning. Review the explanations and practise again.";
        }
    }
}

function restartPractice() {
    if (practiceQuestions.length === 0) {
        startPractice();
        return;
    }

    currentPracticeIndex = 0;
    practiceScore = 0;
    selectedPracticeAnswer = "";
    practiceAnswered = false;

    showScreen("practice-screen");
    displayPracticeQuestion();
}

function exitPractice() {
    showScreen(practiceReturnScreen);
}

// ==========================================
// AI RESPONSE PARSER
// ==========================================

function extractJSON(text) {
    if (typeof text !== "string") {
        throw new Error("The AI returned an empty response.");
    }

    let cleaned = text.trim();

    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        // Find the first complete JSON object while respecting strings.
        const start = cleaned.indexOf("{");

        if (start === -1) {
            throw new Error("The AI did not return a JSON object.");
        }

        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let i = start; i < cleaned.length; i++) {
            const character = cleaned[i];

            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (character === "\\") {
                    escaped = true;
                } else if (character === '"') {
                    inString = false;
                }
            } else {
                if (character === '"') {
                    inString = true;
                } else if (character === "{") {
                    depth++;
                } else if (character === "}") {
                    depth--;

                    if (depth === 0) {
                        const extracted = cleaned.slice(start, i + 1);

                        try {
                            return JSON.parse(extracted);
                        } catch (parseError) {
                            throw new Error(
                                "The AI returned malformed JSON. Please generate again."
                            );
                        }
                    }
                }
            }
        }

        throw new Error("The AI returned incomplete JSON. Please generate again.");
    }
}

// ==========================================
// AI QUESTION GENERATOR
// ==========================================

async function generateAIQuestion() {
    const promptInput =
        document.getElementById("ai-question-prompt");

    const status =
        document.getElementById("ai-generation-status");

    const generateButton = document.querySelector(
        '#question-manager-screen button[onclick="generateAIQuestion()"]'
    );

    const subjectElement =
        document.getElementById("question-subject");

    const chapterElement =
        document.getElementById("question-chapter");

    const topicElement =
        document.getElementById("question-topic");

    if (
        !promptInput ||
        !status ||
        !subjectElement ||
        !chapterElement ||
        !topicElement
    ) {
        alert("AI Question Generator fields are missing in index.html.");
        return;
    }

    const subject = subjectElement.value;
    const chapter = chapterElement.value;
    const topic = topicElement.value.trim();
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        status.textContent = "Please enter your AI instructions.";
        return;
    }

    status.textContent = "EDITH is generating your question...";

    if (generateButton) {
        generateButton.disabled = true;
        generateButton.textContent = "Generating...";
    }

    try {
        const prompt = `
You are an expert IPMAT examination question setter.

Create exactly ONE original multiple-choice question.

Subject: ${subject}
Chapter: ${chapter || "Not applicable"}
Topic: ${topic || "Choose a suitable topic"}

User instructions:
${userPrompt}

Rules:
- Make all question information consistent.
- Solve and verify the question before returning it.
- Include exactly four options.
- Ensure exactly one correct option.
- Make the explanation match the correct answer.
- Use appropriate IPMAT difficulty.
- Return only one valid JSON object.
- Do not include Markdown code fences.
- Do not add text before or after the JSON.
- Escape all quotation marks correctly.

Required structure:
{
  "topic": "Topic name",
  "question": "Complete question",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correctAnswer": "A",
  "explanation": "Step-by-step explanation"
}

correctAnswer must be A, B, C or D.
`;

        const response = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI generation failed.");
        }

        if (!data.answer) {
            throw new Error("The AI returned an empty response.");
        }

        const result = extractJSON(data.answer);

        if (
            !result ||
            typeof result.topic !== "string" ||
            typeof result.question !== "string" ||
            !result.options ||
            typeof result.options.A !== "string" ||
            typeof result.options.B !== "string" ||
            typeof result.options.C !== "string" ||
            typeof result.options.D !== "string" ||
            !["A", "B", "C", "D"].includes(result.correctAnswer) ||
            typeof result.explanation !== "string"
        ) {
            throw new Error("The AI returned incomplete question details.");
        }

        document.getElementById("question-topic").value = result.topic;
        document.getElementById("question-text").value = result.question;

        document.getElementById("option-a").value = result.options.A;
        document.getElementById("option-b").value = result.options.B;
        document.getElementById("option-c").value = result.options.C;
        document.getElementById("option-d").value = result.options.D;

        document.getElementById("correct-answer").value =
            result.correctAnswer;

        document.getElementById("question-explanation").value =
            result.explanation;

        document.getElementById("question-mode").value = "AI Practice";

        status.textContent =
            "Question generated! Verify its accuracy before saving.";

    } catch (error) {
        console.error("EDITH AI Error:", error);
        status.textContent = "Error: " + error.message;

    } finally {
        if (generateButton) {
            generateButton.disabled = false;
            generateButton.textContent = "Generate Question with AI";
        }
    }
}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    const subjectSelect =
        document.getElementById("question-subject");

    if (subjectSelect) {
        subjectSelect.addEventListener(
            "change",
            updateQuestionChapters
        );

        updateQuestionChapters();
    }
});
