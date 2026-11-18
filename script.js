
/* =====================================================
   CODEEASY AI
   Complete JavaScript
   File: script.js
   ===================================================== */

"use strict";


/* =====================================================
   1. HELPER FUNCTIONS
   ===================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

function setText(selector, text) {
    const element = $(selector);

    if (element) {
        element.textContent = text;
    }
}

function showElement(element) {
    if (element) {
        element.hidden = false;
    }
}

function hideElement(element) {
    if (element) {
        element.hidden = true;
    }
}


/* =====================================================
   2. PAGE NAVIGATION
   ===================================================== */

const navigationButtons = $$(".nav-link");
const pageSections = $$(".page-section");

function showPage(pageName) {
    const targetPage = document.getElementById(pageName + "-page");

    if (!targetPage) {
        return;
    }

    pageSections.forEach((page) => {
        page.classList.toggle("active", page === targetPage);
    });

    navigationButtons.forEach((button) => {
        const isActive = button.dataset.page === pageName;

        button.classList.toggle("active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "page");
        } else {
            button.removeAttribute("aria-current");
        }
    });

    const lessonDetail = $("#lesson-detail");
    const conceptGrid = $(".concept-grid");

    if (pageName === "learn") {
        hideElement(lessonDetail);
        showElement(conceptGrid);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageName === "explain") {
        const codeInput = $("#code-input");

        if (codeInput) {
            codeInput.focus({ preventScroll: true });
        }
    }
}

navigationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});


/* =====================================================
   3. CODE EXAMPLES FOR EACH LANGUAGE
   ===================================================== */

const codeExamples = {
    python: `def greet(name):
    message = "Hello, " + name
    print(message)


greet("Mina")`,

    javascript: `function greet(name) {
    const message = "Hello, " + name;
    console.log(message);
}

greet("Mina");`,

    c: `#include <stdio.h>

int main() {
    char name[] = "Mina";

    printf("Hello, %s\\n", name);

    return 0;
}`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    string name = "Mina";

    cout << "Hello, " << name << endl;

    return 0;
}`,

    java: `public class Main {
    public static void main(String[] args) {
        String name = "Mina";

        System.out.println("Hello, " + name);
    }
}`,

    sql: `SELECT
    name,
    age
FROM students
WHERE age >= 18
ORDER BY name;`
};


/* =====================================================
   4. LOAD EXAMPLE BUTTON
   ===================================================== */

const loadExampleButton = $("#load-example-btn");
const languageSelect = $("#language-select");
const codeInput = $("#code-input");

if (loadExampleButton) {
    loadExampleButton.addEventListener("click", () => {
        const language = languageSelect.value;

        codeInput.value =
            codeExamples[language] || codeExamples.python;

        clearExplanation();

        codeInput.focus();

        showMessage(
            "Example loaded successfully. Click Explain this code to continue.",
            "success"
        );
    });
}

if (languageSelect) {
    languageSelect.addEventListener("change", () => {
        // The selected language changes, but existing code
        // is preserved so that the user's work is not lost.

        clearExplanation();
    });
}


/* =====================================================
   5. EXPLANATION MODE
   ===================================================== */

let explanationMode = "explain";

const modeButtons = $$(".mode-btn");

modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        explanationMode = button.dataset.mode;

        modeButtons.forEach((item) => {
            const isActive = item === button;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        setText(
            "#explain-button-text",
            explanationMode === "simple"
                ? "Make this code simpler"
                : "Explain this code"
        );
    });
});


/* =====================================================
   6. EXPLANATION OUTPUT HELPERS
   ===================================================== */

function clearExplanation() {
    hideElement($("#result-panel"));

    const output = $("#explanation-content");

    if (output) {
        output.replaceChildren();
    }

    hideElement($("#loading-message"));
}

function showMessage(message, type = "info") {
    let toast = $("#codeeasy-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "codeeasy-toast";

        Object.assign(toast.style, {
            position: "fixed",
            right: "20px",
            bottom: "20px",
            maxWidth: "min(360px, calc(100vw - 40px))",
            padding: "14px 18px",
            borderRadius: "14px",
            background: "#203540",
            color: "#ffffff",
            fontSize: "13px",
            lineHeight: "1.6",
            boxShadow: "0 8px 25px rgba(0,0,0,.15)",
            zIndex: "9999"
        });

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.borderLeft =
        type === "error"
            ? "4px solid #ff735f"
            : "4px solid #d8ff62";

    toast.setAttribute("role", "status");

    if (toast._hideTimer) {
        clearTimeout(toast._hideTimer);
    }

    toast._hideTimer = setTimeout(() => {
        toast.remove();
    }, 3500);
}

function addTextElement(parent, tag, text, className = "") {
    const element = document.createElement(tag);

    element.textContent = text;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);

    return element;
}


/* =====================================================
   7. LANGUAGE DETECTION HELPERS
   ===================================================== */

function getLanguageName(language) {
    const names = {
        python: "Python",
        javascript: "JavaScript",
        c: "C",
        cpp: "C++",
        java: "Java",
        sql: "SQL"
    };

    return names[language] || language;
}

function describeLine(line, language) {
    const trimmed = line.trim();

    if (!trimmed) {
        return "This is a blank line. It separates parts of the code and makes the program easier to read.";
    }

    if (/^(#include|import |using namespace|package )/.test(trimmed)) {
        return "This line includes or imports code or declarations needed by the program.";
    }

    if (/^(\/\/|# |\/\*|\*|--)/.test(trimmed)) {
        return "This is a comment. It helps people understand the code and is not normally executed as a program instruction.";
    }

    if (/^(def |function |public static void main|public class |int main|async function)/.test(trimmed)) {
        return "This line starts a function or declares a program entry point. The code inside it groups instructions together.";
    }

    if (/^(if |if\(|if\s*\()/.test(trimmed)) {
        return "This line checks a condition. The program can make a decision based on whether the condition is true.";
    }

    if (/^(else|elif |else if|else\s*\{)/.test(trimmed)) {
        return "This line introduces an alternative path when a previous condition is not satisfied.";
    }

    if (/^(for |for\(|for\s*\(|while |while\(|while\s*\()/.test(trimmed)) {
        return "This line starts a loop. A loop repeats instructions according to its condition or sequence.";
    }

    if (/^(return\b)/.test(trimmed)) {
        return "This line returns a result from a function or ends its current execution path.";
    }

    if (/^(print\s*\(|console\.log\s*\(|System\.out\.println\s*\(|printf\s*\(|cout\s*<<)/.test(trimmed)) {
        return "This line displays information. The exact output method depends on the programming language.";
    }

    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(trimmed)) {
        return "This SQL statement queries or changes database information. Read its keywords to understand which operation it performs.";
    }

    if (/^(FROM|WHERE|ORDER BY|GROUP BY|HAVING|JOIN|LIMIT)\b/i.test(trimmed)) {
        return "This SQL clause specifies which data to use, filter, combine, group, or sort.";
    }

    if (/^(break|continue)\s*;?$/.test(trimmed)) {
        return "This statement changes the normal flow of a loop. Break exits the loop; continue skips to the next iteration.";
    }

    if (/^(try|catch|except|finally)\b/.test(trimmed)) {
        return "This line is part of error handling. It helps a program respond when an operation fails.";
    }

    if (/^(const |let |var |int |float |double |char |String |string |bool |boolean )/.test(trimmed)) {
        return "This line declares a variable. A variable gives a name to a value that the program can use later.";
    }

    if (trimmed.includes("=") && !/(==|!=|<=|>=|=>)/.test(trimmed)) {
        return "This line assigns a value or result to a variable, depending on the language and the expression.";
    }

    if (trimmed === "{" || trimmed === "}" || trimmed === "};") {
        return "This brace marks the beginning or end of a code block in languages that use braces.";
    }

    if (trimmed === "pass") {
        return "Pass is a Python placeholder statement. It does nothing by itself.";
    }

    if (/^[\w.]+\s*\(.*\)\s*;?$/.test(trimmed)) {
        return "This line appears to call a function or method. It asks that reusable block of code to perform an operation.";
    }

    return "This line is part of the program's logic. Its exact meaning depends on the surrounding code and the programming language.";
}


/* =====================================================
   8. BUILD A LOCAL EXPLANATION
   ===================================================== */

/*
   This provides a basic explanation without an AI service.
   It is a learning aid, not a full compiler or AI model.
*/

function explainCodeLocally(code, language, simpleMode) {
    const result = document.createDocumentFragment();

    const lines = code.split("\n");

    addTextElement(
        result,
        "h3",
        `${getLanguageName(language)} code overview`
    );

    addTextElement(
        result,
        "p",
        `Your code contains ${lines.length} lines, including blank lines. Here is a basic walkthrough of the code structure.`
    );

    addTextElement(result, "h3", "Line-by-line walkthrough");

    lines.forEach((line, index) => {
        const lineBox = document.createElement("div");

        Object.assign(lineBox.style, {
            marginTop: "12px",
            padding: "12px",
            borderRadius: "12px",
            background: "#f4f1e7"
        });

        const sourceLine = document.createElement("code");

        sourceLine.textContent =
            `${index + 1}. ${line || "(blank line)"}`;

        Object.assign(sourceLine.style, {
            display: "block",
            marginBottom: "7px",
            color: "#203540",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere"
        });

        lineBox.appendChild(sourceLine);

        addTextElement(
            lineBox,
            "p",
            describeLine(line, language)
        );

        result.appendChild(lineBox);
    });

    addTextElement(result, "h3", "What to remember");

    addTextElement(
        result,
        "p",
        simpleMode
            ? "Start by understanding the names, values, conditions, and actions in the code. Then follow the instructions in order."
            : "The exact behavior depends on the relationship between statements, variables, functions, conditions, and the language's syntax. This local walkthrough identifies common patterns but does not execute the program."
    );

    addTextElement(
        result,
        "p",
        "Note: This is a basic offline explanation. For context-aware AI explanations, connect a secure backend to an AI model."
    );

    return result;
}


/* =====================================================
   9. EXPLAIN CODE BUTTON
   ===================================================== */

/*
   Optional backend endpoint:
   POST /api/explain

   Expected JSON request:
   {
       "code": "...",
       "language": "python",
       "mode": "explain"
   }

   Expected JSON response:
   {
       "explanation": "..."
   }

   The backend must securely call the AI service.
   Never put a private API key in this frontend file.
*/

async function requestAIExplanation(code, language, mode) {
    const response = await fetch("/api/explain", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            code,
            language,
            mode
        })
    });

    if (!response.ok) {
        throw new Error(`Explanation service returned ${response.status}`);
    }

    const data = await response.json();

    if (
        !data ||
        typeof data.explanation !== "string" ||
        !data.explanation.trim()
    ) {
        throw new Error("The explanation service returned an invalid response.");
    }

    return data.explanation;
}

function displayAIExplanation(text) {
    const output = $("#explanation-content");

    output.replaceChildren();

    // Use textContent rather than innerHTML so that
    // returned text is not interpreted as executable HTML.

    const paragraphs = text.split(/\n{2,}/);

    paragraphs.forEach((paragraph) => {
        addTextElement(output, "p", paragraph.trim());
    });
}

const explainCodeButton = $("#explain-code-btn");

if (explainCodeButton) {
    explainCodeButton.addEventListener("click", async () => {
        const code = codeInput.value.trim();
        const language = languageSelect.value;

        if (!code) {
            showMessage("Please paste your code first.", "error");
            codeInput.focus();
            return;
        }

        const originalButtonText =
            $("#explain-button-text").textContent;

        explainCodeButton.disabled = true;

        setText("#explain-button-text", "Thinking...");

        showElement($("#result-panel"));
        showElement($("#loading-message"));

        const output = $("#explanation-content");

        output.replaceChildren();

        try {
            /*
               Try the connected backend first.
               If it is unavailable, use the local explanation.
            */

            let explanation;

            try {
                explanation = await requestAIExplanation(
                    code,
                    language,
                    explanationMode
                );

                displayAIExplanation(explanation);

            } catch (error) {
                console.info(
                    "AI backend unavailable; using local explanation.",
                    error.message
                );

                output.replaceChildren(
                    explainCodeLocally(
                        code,
                        language,
                        explanationMode === "simple"
                    )
                );
            }

        } catch (error) {
            console.error("Explanation error:", error);

            addTextElement(
                output,
                "p",
                "Sorry, we could not prepare an explanation. Please try again."
            );

        } finally {
            hideElement($("#loading-message"));

            explainCodeButton.disabled = false;

            setText(
                "#explain-button-text",
                originalButtonText
            );
        }
    });
}


/* =====================================================
   10. CLEAR EXPLANATION
   ===================================================== */

const clearResultButton = $("#clear-result-btn");

if (clearResultButton) {
    clearResultButton.addEventListener("click", () => {
        clearExplanation();
    });
}


/* =====================================================
   11. LEARN CONCEPTS DATA
   ===================================================== */

const conceptLessons = {
    variables: {
        title: "Variables",
        description:
            "A variable is a named place where a program can store a value. You can use that name later to access the value.",
        code:
            'name = "Mina"\nage = 20\nprint(name)',
        takeaway:
            "A variable connects a meaningful name to a value. The syntax depends on the programming language."
    },

    functions: {
        title: "Functions",
        description:
            "A function groups instructions under a name so that you can reuse them instead of writing the same steps again.",
        code:
            'def greet(name):\n    print("Hello, " + name)\n\ngreet("Mina")',
        takeaway:
            "Define the function first, then call it when you want its instructions to run."
    },

    conditionals: {
        title: "Conditionals",
        description:
            "Conditionals let a program choose what to do depending on whether a condition is true or false.",
        code:
            'age = 20\n\nif age >= 18:\n    print("Adult")\nelse:\n    print("Not an adult")',
        takeaway:
            "Use if and else to make decisions. Indentation is important in Python."
    },

    loops: {
        title: "Loops",
        description:
            "A loop repeats an instruction or a group of instructions. It is useful when you need to do similar work more than once.",
        code:
            'for number in range(1, 4):\n    print(number)',
        takeaway:
            "Understand how many times the loop repeats and how its control variable changes."
    },

    lists: {
        title: "Lists",
        description:
            "A list stores multiple items in a single ordered collection. In Python, you can access items using their indexes.",
        code:
            'fruits = ["apple", "mango", "banana"]\n\nprint(fruits[0])',
        takeaway:
            "Python list indexes start at zero, so fruits[0] returns the first item."
    },

    errors: {
        title: "Errors",
        description:
            "An error is a signal that something went wrong. Reading the message and locating the relevant line can help you find the cause.",
        code:
            'name = "Mina"\nprint(nam)',
        takeaway:
            "The example contains a misspelled variable name. The program uses name, but the print statement refers to nam."
    }
};


/* =====================================================
   12. OPEN A CONCEPT LESSON
   ===================================================== */

const lessonButtons = $$(".lesson-button");

const conceptGrid = $(".concept-grid");
const lessonDetail = $("#lesson-detail");

lessonButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const lesson = conceptLessons[button.dataset.concept];

        if (!lesson) {
            return;
        }

        setText("#lesson-title", lesson.title);
        setText("#lesson-description", lesson.description);
        setText("#lesson-code", lesson.code);
        setText("#lesson-takeaway", lesson.takeaway);

        hideElement(conceptGrid);
        showElement(lessonDetail);

        lessonDetail.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


/* =====================================================
   13. BACK TO CONCEPTS
   ===================================================== */

const backToConceptsButton = $("#back-to-concepts");

if (backToConceptsButton) {
    backToConceptsButton.addEventListener("click", () => {
        hideElement(lessonDetail);
        showElement(conceptGrid);

        conceptGrid.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


/* =====================================================
   14. TRY A LESSON IN EXPLAIN CODE
   ===================================================== */

const tryLessonButton = $("#try-lesson-btn");

if (tryLessonButton) {
    tryLessonButton.addEventListener("click", () => {
        const lessonCode = $("#lesson-code").textContent;

        showPage("explain");

        if (codeInput) {
            codeInput.value = lessonCode;
        }

        if (languageSelect) {
            languageSelect.value = "python";
        }

        clearExplanation();

        showMessage(
            "Lesson example added to the code editor."
        );
    });
}


/* =====================================================
   15. PRACTICE QUESTIONS
   ===================================================== */

const practiceQuestions = {
    greeting: {
        title: "A tiny greeting",
        level: "WARM-UP",
        category: "practice / greeting",

        description:
            'Create a variable called "name", put your name inside it, then print a greeting that includes it.',

        hint:
            'Start with name = "..." and use print on the next line.',

        answerKeywords: [
            "name",
            "print"
        ],

        successMessage:
            "Nice work! Your answer uses a name variable and a print statement. Try changing the name and running the code to understand it better."
    },

    jacket: {
        title: "Pack a layer",
        level: "ONE DECISION",
        category: "practice / conditionals",

        description:
            "Create a temperature variable. If the temperature is below 20, print a message reminding someone to take a jacket.",

        hint:
            "Use a temperature variable, an if statement, a comparison with 20, and a print statement.",

        answerKeywords: [
            "if",
            "print"
        ],

        successMessage:
            "Good attempt! You have included a condition and an output statement. Check that your temperature variable is compared with 20 and that the message appears when the condition is true."
    },

    shopping: {
        title: "The shopping list",
        level: "SMALL LOOP",
        category: "practice / loops",

        description:
            "Create a list containing three shopping items, then use a for loop to print each item on its own line.",

        hint:
            "Start with a list such as items = ['milk', 'bread', 'eggs']. Then use for item in items.",

        answerKeywords: [
            "for",
            "in",
            "print"
        ],

        successMessage:
            "Great effort! Your code includes a loop and an output statement. Check that the loop goes through the shopping list and prints the current item."
    }
};

let selectedPractice = "greeting";

const attemptedPractices = new Set();

const practiceOptions = $$(".practice-option");

const practiceCodeInput = $("#practice-code");


/* =====================================================
   16. DISPLAY A PRACTICE QUESTION
   ===================================================== */

function displayPracticeQuestion(questionId) {
    const question = practiceQuestions[questionId];

    if (!question) {
        return;
    }

    selectedPractice = questionId;

    practiceOptions.forEach((button) => {
        const active = button.dataset.practice === questionId;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    setText("#practice-title", question.title);
    setText("#practice-level", question.level);
    setText("#practice-category", question.category);
    setText("#practice-description", question.description);
    setText("#practice-hint", question.hint);

    practiceCodeInput.value = "";

    hideElement($("#practice-feedback"));

    const markAttemptButton = $("#mark-attempt-btn");

    if (markAttemptButton) {
        markAttemptButton.textContent =
            attemptedPractices.has(questionId)
                ? "Attempt recorded ✓"
                : "I gave it a go →";
    }
}

practiceOptions.forEach((button) => {
    button.addEventListener("click", () => {
        displayPracticeQuestion(button.dataset.practice);
    });
});


/* =====================================================
   17. PRACTICE HINT BUTTON
   ===================================================== */

const showHintButton = $("#show-hint-btn");

if (showHintButton) {
    showHintButton.addEventListener("click", () => {
        const question = practiceQuestions[selectedPractice];

        if (!question) {
            return;
        }

        setText("#practice-hint", question.hint);

        showElement($("#practice-feedback"));

        const feedback = $("#practice-feedback");

        feedback.classList.remove("error");

        feedback.textContent = "Hint: " + question.hint;
    });
}


/* =====================================================
   18. BASIC PRACTICE ANSWER CHECKER
   ===================================================== */

/*
   This is a simple keyword-based learning checker.
   It does not execute code and cannot guarantee correctness.
*/

function checkPracticeAnswer(code, question) {
    const normalized = code.toLowerCase();

    if (!normalized.trim()) {
        return {
            correct: false,
            message: "Write a small attempt first. Even two or three lines are a good start."
        };
    }

    const missingKeywords = question.answerKeywords.filter(
        (keyword) => !normalized.includes(keyword.toLowerCase())
    );

    if (missingKeywords.length > 0) {
        return {
            correct: false,
            message:
                "You're getting started! Review the hint and check that your code includes: " +
                missingKeywords.join(", ") +
                "."
        };
    }

    if (selectedPractice === "greeting") {
        const hasNameAssignment =
            /\bname\s*=\s*["']/.test(code);

        const hasPrint =
            /\bprint\s*\(/.test(code);

        if (!hasNameAssignment || !hasPrint) {
            return {
                correct: false,
                message:
                    'For this Python exercise, assign a string to name, then use print(...) to display a greeting.'
            };
        }
    }

    if (selectedPractice === "jacket") {
        const hasComparison =
            /(<|>|==|<=|>=)/.test(code);

        const hasTemperature =
            /temperature|temp/i.test(code);

        if (!hasComparison || !hasTemperature) {
            return {
                correct: false,
                message:
                    "Check that you use a temperature variable and compare its value with 20 inside an if statement."
            };
        }
    }

    if (selectedPractice === "shopping") {
        const hasList =
            /\[[\s\S]*\]/.test(code);

        const hasLoop =
            /\bfor\b[\s\S]*\bin\b/.test(code);

        if (!hasList || !hasLoop) {
            return {
                correct: false,
                message:
                    "Check that you create a list and loop over its items using for item in items."
            };
        }
    }

    return {
        correct: true,
        message: question.successMessage
    };
}

const checkPracticeButton = $("#check-practice-btn");

if (checkPracticeButton) {
    checkPracticeButton.addEventListener("click", () => {
        const question = practiceQuestions[selectedPractice];

        const answer = practiceCodeInput.value.trim();

        const result = checkPracticeAnswer(answer, question);

        const feedback = $("#practice-feedback");

        feedback.textContent = result.message;

        feedback.classList.toggle("error", !result.correct);

        showElement(feedback);

        recordAttempt(selectedPractice);
    });
}


/* =====================================================
   19. RECORD PRACTICE PROGRESS
   ===================================================== */

function updateProgress() {
    setText("#attempt-count", String(attemptedPractices.size));

    setText(
        "#total-prompts",
        String(Object.keys(practiceQuestions).length)
    );
}

function recordAttempt(questionId) {
    attemptedPractices.add(questionId);

    updateProgress();

    const markAttemptButton = $("#mark-attempt-btn");

    if (markAttemptButton && selectedPractice === questionId) {
        markAttemptButton.textContent = "Attempt recorded ✓";
    }
}

const markAttemptButton = $("#mark-attempt-btn");

if (markAttemptButton) {
    markAttemptButton.addEventListener("click", () => {
        recordAttempt(selectedPractice);

        const feedback = $("#practice-feedback");

        feedback.classList.remove("error");

        feedback.textContent =
            "Well done for trying! Every attempt helps you learn. Review the hint, make a small change, and try again.";

        showElement(feedback);
    });
}


/* =====================================================
   20. INITIALIZE THE WEBSITE
   ===================================================== */

function initializeCodeEasy() {
    // Set the initial navigation state.

    showPage("explain");

    // Set the initial practice question.

    displayPracticeQuestion("greeting");

    // Update the progress indicator.

    updateProgress();

    // Set initial button accessibility states.

    modeButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.mode === explanationMode)
        );
    });

    navigationButtons.forEach((button) => {
        if (button.dataset.page === "explain") {
            button.setAttribute("aria-current", "page");
        }
    });

    console.log("CodeEasy AI initialized successfully.");
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCodeEasy
    );
} else {
    initializeCodeEasy();
}
