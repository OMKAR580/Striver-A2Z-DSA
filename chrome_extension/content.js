// Striver A2Z DSA Auto-Sync Content Script
(function () {
    console.log("🚀 Striver DSA Auto-Sync Extension Active!");

    let isModalOpen = false;
    const handledSubmissions = new Set();

    // Observer to detect submission completion
    const observer = new MutationObserver(() => {
        detectSuccessfulSubmission();
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    function detectSuccessfulSubmission() {
        if (isModalOpen) return;

        const problemTitle = extractProblemTitle();
        if (!problemTitle || handledSubmissions.has(problemTitle)) return;

        const url = window.location.href;
        let isSuccess = false;

        // 1. TakeUForward (Striver's official site)
        if (url.includes("takeuforward.org")) {
            const successElems = Array.from(document.querySelectorAll("*")).filter(el => {
                const text = el.textContent || "";
                return (text.includes("Accepted") || text.includes("Passed All Test Cases") || text.includes("100% Passed") || text.includes("Correct Answer"))
                       && el.children.length === 0;
            });
            if (successElems.length > 0) {
                isSuccess = true;
            }
        }
        // 2. LeetCode
        else if (url.includes("leetcode.com")) {
            const acceptedElem = document.querySelector('[data-e2e-locator="submission-result"]') ||
                                 document.querySelector('.text-sd-success') ||
                                 Array.from(document.querySelectorAll('span, div')).find(el => el.textContent.trim() === 'Accepted' && el.children.length === 0);
            if (acceptedElem) {
                isSuccess = true;
            }
        }
        // 3. GeeksforGeeks
        else if (url.includes("geeksforgeeks.org")) {
            const gfgSuccess = Array.from(document.querySelectorAll('*')).find(el => el.textContent.includes("Problem Solved Successfully") && el.children.length === 0);
            if (gfgSuccess) {
                isSuccess = true;
            }
        }
        // 4. Code360 / CodingNinjas
        else if (url.includes("naukri.com") || url.includes("codingninjas")) {
            const cnSuccess = Array.from(document.querySelectorAll('*')).find(el => (el.textContent.includes("Passed All Test Cases") || el.textContent.includes("Correct Answer")) && el.children.length === 0);
            if (cnSuccess) {
                isSuccess = true;
            }
        }

        if (isSuccess) {
            console.log(`🎉 Successful submission detected for "${problemTitle}"! Opening sync modal...`);
            triggerSyncModal();
        }
    }

    // Manual trigger listener from window shortcut or extension toolbar
    window.addEventListener("message", (event) => {
        if (event.data && event.data.type === "TRIGGER_STRIVER_SYNC") {
            const title = extractProblemTitle();
            if (title) handledSubmissions.delete(title); // allow manual trigger
            triggerSyncModal();
        }
    });

    async function triggerSyncModal() {
        if (isModalOpen) return;

        const problemTitle = extractProblemTitle();
        if (handledSubmissions.has(problemTitle)) return;

        isModalOpen = true;

        const code = extractCode();
        const language = extractLanguage();
        const questionUrl = window.location.href;

        // Fetch available folders from local server
        let availableFolders = [];
        try {
            const res = await fetch("http://localhost:3456/api/folders");
            const data = await res.json();
            if (data.success && data.folders.length > 0) {
                availableFolders = data.folders;
            }
        } catch (e) {
            console.warn("Could not fetch folders from local server (is server running?):", e);
        }

        if (availableFolders.length === 0) {
            availableFolders = [
                "01_Learn_Basics/patterns",
                "01_Learn_Basics/basic_maths",
                "01_Learn_Basics/basic_recursion",
                "01_Learn_Basics/basic_hashing",
                "02_Sorting",
                "03_Arrays/easy",
                "03_Arrays/medium",
                "03_Arrays/hard",
                "04_Binary_Search/1d_arrays",
                "05_Strings/basic_and_easy",
                "06_Linked_List/1d_linkedlist",
                "07_Recursion/subsequences",
                "08_Bit_Manipulation/learn_bit_manipulation",
                "09_Stack_and_Queue/learning",
                "10_Sliding_Window_Two_Pointer/medium_problems",
                "11_Heaps/learning",
                "12_Greedy_Algorithms/easy",
                "13_Binary_Trees/traversals",
                "14_Binary_Search_Trees/concepts",
                "15_Graphs/learning",
                "16_Dynamic_Programming/1d_dp",
                "17_Tries/theory",
                "18_Strings_Advanced"
            ];
        }

        const suggestedFolder = autoMatchFolder(problemTitle, availableFolders);
        const fileExt = getFileExtension(language);
        const suggestedFilename = sanitizeFilename(problemTitle) + fileExt;
        const existingNotes = extractNotes();

        renderModal({
            problemTitle,
            code,
            language,
            questionUrl,
            availableFolders,
            suggestedFolder,
            suggestedFilename,
            existingNotes
        });
    }

    function renderModal(data) {
        const existing = document.getElementById("striver-sync-overlay-root");
        if (existing) existing.remove();

        const overlay = document.createElement("div");
        overlay.id = "striver-sync-overlay-root";
        overlay.className = "striver-sync-overlay";

        const folderOptionsHtml = data.availableFolders.map(f => {
            const selected = (f === data.suggestedFolder) ? 'selected="selected"' : '';
            return `<option value="${f}" ${selected}>📁 ${f}</option>`;
        }).join('');

        overlay.innerHTML = `
            <div class="striver-sync-modal">
                <div class="striver-sync-header">
                    <div class="striver-sync-title-group">
                        <span class="striver-sync-badge">🎉 Accepted</span>
                        <h3 class="striver-sync-modal-title">Striver A2Z Auto-Sync</h3>
                    </div>
                    <button class="striver-sync-close-btn" id="striver-sync-close">✕</button>
                </div>
                <div class="striver-sync-body">
                    <div class="striver-sync-problem-card">
                        <div class="striver-sync-problem-name" title="${data.problemTitle}">${data.problemTitle}</div>
                        <div class="striver-sync-problem-meta">
                            <span>💻 Lang: <strong>${data.language.toUpperCase()}</strong></span>
                            <span>📄 Lines: <strong>${data.code.split('\n').length}</strong></span>
                        </div>
                    </div>

                    <div class="striver-sync-field-group">
                        <label class="striver-sync-label">Target Local & GitHub Folder</label>
                        <select class="striver-sync-select" id="striver-sync-folder-select">
                            ${folderOptionsHtml}
                        </select>
                    </div>

                    <div class="striver-sync-field-group">
                        <label class="striver-sync-label">Filename</label>
                        <input type="text" class="striver-sync-input code-font" id="striver-sync-filename-input" value="${data.suggestedFilename}" />
                    </div>

                    <div class="striver-sync-field-group">
                        <label class="striver-sync-label">📝 Personal Notes (Saved Locally Only • Ignored by Git)</label>
                        <textarea class="striver-sync-textarea" id="striver-sync-notes-input" placeholder="Add key intuition, complexity, or notes here... (Saved in local project only, never pushed to GitHub)">${data.existingNotes || ''}</textarea>
                    </div>

                    <div class="striver-sync-target-preview">
                        Destination: <span id="striver-sync-path-preview">D:/Stirver_A2Z_DSA/${data.suggestedFolder}/${data.suggestedFilename}</span>
                    </div>

                    <div class="striver-sync-actions">
                        <button class="striver-sync-btn striver-sync-btn-secondary" id="striver-sync-cancel-btn">Cancel</button>
                        <button class="striver-sync-btn striver-sync-btn-primary" id="striver-sync-push-btn">
                            🚀 Save & Push to GitHub
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const folderSelect = document.getElementById("striver-sync-folder-select");
        const filenameInput = document.getElementById("striver-sync-filename-input");
        const notesInput = document.getElementById("striver-sync-notes-input");
        const pathPreview = document.getElementById("striver-sync-path-preview");
        const pushBtn = document.getElementById("striver-sync-push-btn");
        const cancelBtn = document.getElementById("striver-sync-cancel-btn");
        const closeBtn = document.getElementById("striver-sync-close");

        function updatePreview() {
            pathPreview.textContent = `D:/Stirver_A2Z_DSA/${folderSelect.value}/${filenameInput.value}`;
        }

        folderSelect.addEventListener("change", updatePreview);
        filenameInput.addEventListener("input", updatePreview);

        const dismissModal = (wasCancelled) => {
            handledSubmissions.add(data.problemTitle);
            overlay.remove();
            isModalOpen = false;
            if (wasCancelled) {
                showToast("ℹ️ Sync Dismissed", "Auto-sync closed for this problem. You can sync anytime from toolbar icon.", false);
            }
        };

        cancelBtn.addEventListener("click", () => dismissModal(true));
        closeBtn.addEventListener("click", () => dismissModal(true));

        pushBtn.addEventListener("click", async () => {
            pushBtn.disabled = true;
            pushBtn.innerHTML = `⏳ Saving & Pushing...`;

            const folder = folderSelect.value;
            const filename = filenameInput.value.trim();
            const notes = notesInput.value.trim();

            try {
                const response = await fetch("http://localhost:3456/api/push", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code: data.code,
                        filename: filename,
                        folder: folder,
                        questionTitle: data.problemTitle,
                        questionUrl: data.questionUrl,
                        language: data.language,
                        notes: notes
                    })
                });

                const result = await response.json();
                dismissModal(false);

                if (result.success) {
                    // Step 1: Local Save Popup Notification
                    showToast("📁 Step 1: Saved Locally!", `File: D:/Stirver_A2Z_DSA/${result.relFilePath || (folder + '/' + filename)}${result.notesSaved ? '\n📝 Notes: Saved locally (.notes.md)' : ''}`, false);

                    // Step 2: GitHub Push Popup Notification (with short delay)
                    setTimeout(() => {
                        if (result.gitPushed) {
                            showToast("🚀 Step 2: Pushed to GitHub!", `Repository: OMKAR580/Striver-A2Z-DSA\nCommit: Add solution: ${data.problemTitle}`, false);
                        } else {
                            showToast("⚠️ Step 2: Local Saved (Git Pending)", result.message, true);
                        }
                    }, 1400);
                } else {
                    showToast("❌ Push Failed", result.message, true);
                }
            } catch (err) {
                dismissModal(false);
                showToast("❌ Connection Error", "Local server (http://localhost:3456) is not running!\nPlease run start_sync_server.bat", true);
            }
        });
    }

    function showToast(title, message, isError) {
        const existing = document.getElementById("striver-sync-toast-root");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.id = "striver-sync-toast-root";
        toast.className = `striver-sync-toast ${isError ? 'error' : ''}`;
        toast.innerHTML = `
            <div class="striver-sync-toast-icon">${isError ? '⚠️' : '🚀'}</div>
            <div class="striver-sync-toast-content">
                <div class="striver-sync-toast-title">${title}</div>
                <div class="striver-sync-toast-message">${message}</div>
            </div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 6000);
    }

    // Helper functions
    function extractProblemTitle() {
        // 1. Check headings
        const h1 = document.querySelector("h1, h2.problem-title, .title__1x9h, div[data-cy='question-title']");
        if (h1 && h1.textContent.trim()) {
            return h1.textContent.trim().replace(/^\d+\.\s*/, '');
        }

        // 2. Check title tag
        const documentTitle = document.title;
        if (documentTitle) {
            return documentTitle.split('-')[0].split('|')[0].trim();
        }

        return "DSA_Question";
    }

    function extractCode() {
        // Monaco Editor lines (used by LeetCode, TakeUForward, GFG)
        const monacoLines = document.querySelectorAll(".monaco-editor .view-line");
        if (monacoLines.length > 0) {
            return Array.from(monacoLines).map(line => line.textContent.replace(/\u00a0/g, ' ')).join('\n');
        }

        // CodeMirror (used by GFG, CN)
        const cmLines = document.querySelectorAll(".CodeMirror-line");
        if (cmLines.length > 0) {
            return Array.from(cmLines).map(line => line.textContent).join('\n');
        }

        // Textarea or pre code fallback
        const textarea = document.querySelector("textarea.code-editor, textarea");
        if (textarea && textarea.value) {
            return textarea.value;
        }

        const codeTag = document.querySelector("pre code, code");
        if (codeTag) {
            return codeTag.textContent;
        }

        return "// Solution Code\n";
    }

    function extractLanguage() {
        const langElem = document.querySelector("[data-cy='lang-select'], select.lang-select, .ant-select-selection-selected-value");
        if (langElem && langElem.textContent) {
            const text = langElem.textContent.toLowerCase();
            if (text.includes("c++") || text.includes("cpp")) return "cpp";
            if (text.includes("java")) return "java";
            if (text.includes("python")) return "py";
            if (text.includes("javascript") || text.includes("js")) return "js";
        }

        // Fallback: Code contents heuristic
        const code = extractCode();
        if (code.includes("#include") || code.includes("std::")) return "cpp";
        if (code.includes("public class") || code.includes("System.out")) return "java";
        if (code.includes("def ") || code.includes("import sys")) return "py";

        return "cpp"; // default to C++ for Striver's sheet
    }

    function getFileExtension(lang) {
        switch (lang.toLowerCase()) {
            case "cpp": case "c++": return ".cpp";
            case "java": return ".java";
            case "py": case "python": return ".py";
            case "js": case "javascript": return ".js";
            default: return ".cpp";
        }
    }

    function sanitizeFilename(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    // Master Striver A2Z Sheet Problem Folder Mapping
    const STRIVER_SHEET_MAP = {
        // 01_Learn_Basics
        "pattern": "01_Learn_Basics/patterns",
        "pattern 1": "01_Learn_Basics/patterns",
        "count digits": "01_Learn_Basics/basic_maths",
        "reverse digits": "01_Learn_Basics/basic_maths",
        "reverse number": "01_Learn_Basics/basic_maths",
        "check palindrome": "01_Learn_Basics/basic_maths",
        "gcd or hcf": "01_Learn_Basics/basic_maths",
        "armstrong numbers": "01_Learn_Basics/basic_maths",
        "print all divisors": "01_Learn_Basics/basic_maths",
        "check for prime": "01_Learn_Basics/basic_maths",
        "print 1 to n": "01_Learn_Basics/basic_recursion",
        "print n to 1": "01_Learn_Basics/basic_recursion",
        "sum of first n terms": "01_Learn_Basics/basic_recursion",
        "factorial of n": "01_Learn_Basics/basic_recursion",
        "reverse an array": "01_Learn_Basics/basic_recursion",
        "fibonacci number": "01_Learn_Basics/basic_recursion",
        "count frequency": "01_Learn_Basics/basic_hashing",
        "highest / lowest frequency": "01_Learn_Basics/basic_hashing",

        // 02_Sorting
        "selection sort": "02_Sorting",
        "bubble sort": "02_Sorting",
        "insertion sort": "02_Sorting",
        "merge sort": "02_Sorting",
        "quick sort": "02_Sorting",

        // 03_Arrays - Easy
        "largest element": "03_Arrays/easy",
        "largest element in an array": "03_Arrays/easy",
        "second largest": "03_Arrays/easy",
        "second largest element": "03_Arrays/easy",
        "second largest element in an array": "03_Arrays/easy",
        "check if array is sorted": "03_Arrays/easy",
        "check if the array is sorted": "03_Arrays/easy",
        "check if the array is sorted ii": "03_Arrays/easy",
        "remove duplicates from sorted array": "03_Arrays/easy",
        "remove duplicates from an array": "03_Arrays/easy",
        "left rotate array by one": "03_Arrays/easy",
        "left rotate array by k places": "03_Arrays/easy",
        "left rotate an array by one": "03_Arrays/easy",
        "move zeros to end": "03_Arrays/easy",
        "move zeroes to end": "03_Arrays/easy",
        "move zero's to end": "03_Arrays/easy",
        "linear search": "03_Arrays/easy",
        "union of two sorted arrays": "03_Arrays/easy",
        "find missing number": "03_Arrays/easy",
        "missing number": "03_Arrays/easy",
        "max consecutive ones": "03_Arrays/easy",
        "single number": "03_Arrays/easy",
        "longest subarray with sum k": "03_Arrays/easy",

        // 03_Arrays - Medium
        "two sum": "03_Arrays/medium",
        "sort colors": "03_Arrays/medium",
        "sort an array of 0s 1s 2s": "03_Arrays/medium",
        "majority element": "03_Arrays/medium",
        "kadane's algorithm": "03_Arrays/medium",
        "maximum subarray": "03_Arrays/medium",
        "maximum subarray sum": "03_Arrays/medium",
        "stock buy and sell": "03_Arrays/medium",
        "best time to buy and sell stock": "03_Arrays/medium",
        "rearrange array elements by sign": "03_Arrays/medium",
        "next permutation": "03_Arrays/medium",
        "leaders in an array": "03_Arrays/medium",
        "longest consecutive sequence": "03_Arrays/medium",
        "set matrix zeroes": "03_Arrays/medium",
        "set matrix zero": "03_Arrays/medium",
        "rotate image": "03_Arrays/medium",
        "rotate matrix": "03_Arrays/medium",
        "rotate matrix by 90 degrees": "03_Arrays/medium",
        "spiral matrix": "03_Arrays/medium",
        "count subarrays with given sum": "03_Arrays/medium",

        // 03_Arrays - Hard
        "pascal's triangle": "03_Arrays/hard",
        "majority element ii": "03_Arrays/hard",
        "majority element 2": "03_Arrays/hard",
        "3sum": "03_Arrays/hard",
        "4sum": "03_Arrays/hard",
        "largest subarray with 0 sum": "03_Arrays/hard",
        "count subarrays with given xor k": "03_Arrays/hard",
        "merge overlapping subintervals": "03_Arrays/hard",
        "merge intervals": "03_Arrays/hard",
        "merge two sorted arrays without extra space": "03_Arrays/hard",
        "find missing and repeating number": "03_Arrays/hard",
        "count inversions": "03_Arrays/hard",
        "reverse pairs": "03_Arrays/hard",
        "maximum product subarray": "03_Arrays/hard",

        // 04_Binary_Search
        "binary search": "04_Binary_Search/1d_arrays",
        "implement lower bound": "04_Binary_Search/1d_arrays",
        "implement upper bound": "04_Binary_Search/1d_arrays",
        "search insert position": "04_Binary_Search/1d_arrays",
        "search in rotated sorted array": "04_Binary_Search/1d_arrays",
        "find minimum in rotated sorted array": "04_Binary_Search/1d_arrays",
        "koko eating bananas": "04_Binary_Search/on_answers",
        "book allocation problem": "04_Binary_Search/on_answers",
        "search a 2d matrix": "04_Binary_Search/2d_arrays",

        // 05_Strings
        "remove outer parentheses": "05_Strings/basic_and_easy",
        "reverse words in a string": "05_Strings/basic_and_easy",
        "valid anagram": "05_Strings/basic_and_easy",
        "isomorphic strings": "05_Strings/basic_and_easy",

        // 06_Linked_List
        "introduction to linked list": "06_Linked_List/1d_linkedlist",
        "middle of a linked list": "06_Linked_List/medium_1d",
        "reverse a linked list": "06_Linked_List/medium_1d",
        "detect a loop in linked list": "06_Linked_List/medium_1d"
    };

    function autoMatchFolder(title, availableFolders) {
        const lowerTitle = title.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

        // 1. Direct match in Master Striver Sheet Table
        for (const [key, folderPath] of Object.entries(STRIVER_SHEET_MAP)) {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9\s]/g, '');
            if (lowerTitle.includes(cleanKey) || cleanKey.includes(lowerTitle)) {
                const matched = findFolder(folderPath, availableFolders);
                if (matched) return matched;
            }
        }

        // 2. Scrape TakeUForward Section / Accordion / Breadcrumbs from Page DOM
        const pageDOMFolder = scrapeSectionFromDOM(availableFolders);
        if (pageDOMFolder) return pageDOMFolder;

        // 3. Smart Keyword Fallbacks (Arrays BEFORE Sorting!)
        if (lowerTitle.includes("pattern")) return findFolder("01_Learn_Basics/patterns", availableFolders);
        if (lowerTitle.includes("math") || lowerTitle.includes("digit") || lowerTitle.includes("prime") || lowerTitle.includes("armstrong") || lowerTitle.includes("gcd")) {
            return findFolder("01_Learn_Basics/basic_maths", availableFolders);
        }

        // Check ARRAYS before checking sort! (e.g. "sorted array" -> Arrays)
        if (lowerTitle.includes("array") || lowerTitle.includes("element") || lowerTitle.includes("subarrays")) {
            if (lowerTitle.includes("hard") || lowerTitle.includes("3sum") || lowerTitle.includes("4sum") || lowerTitle.includes("pascal")) {
                return findFolder("03_Arrays/hard", availableFolders);
            }
            if (lowerTitle.includes("medium") || lowerTitle.includes("two sum") || lowerTitle.includes("kadane") || lowerTitle.includes("matrix")) {
                return findFolder("03_Arrays/medium", availableFolders);
            }
            return findFolder("03_Arrays/easy", availableFolders);
        }

        if (lowerTitle.includes("sorting") || lowerTitle.includes("sort colors") || lowerTitle.includes("merge sort") || lowerTitle.includes("quick sort")) {
            return findFolder("02_Sorting", availableFolders);
        }
        if (lowerTitle.includes("binary search") || lowerTitle.includes("bound")) {
            return findFolder("04_Binary_Search/1d_arrays", availableFolders);
        }
        if (lowerTitle.includes("string") || lowerTitle.includes("anagram")) {
            return findFolder("05_Strings/basic_and_easy", availableFolders);
        }
        if (lowerTitle.includes("linked list") || lowerTitle.includes("ll")) {
            return findFolder("06_Linked_List/1d_linkedlist", availableFolders);
        }
        if (lowerTitle.includes("stack") || lowerTitle.includes("queue")) {
            return findFolder("09_Stack_and_Queue/learning", availableFolders);
        }
        if (lowerTitle.includes("tree")) {
            return findFolder("13_Binary_Trees/traversals", availableFolders);
        }
        if (lowerTitle.includes("graph")) {
            return findFolder("15_Graphs/learning", availableFolders);
        }
        if (lowerTitle.includes("dp") || lowerTitle.includes("dynamic programming")) {
            return findFolder("16_Dynamic_Programming/1d_dp", availableFolders);
        }

        return findFolder("03_Arrays/easy", availableFolders);
    }

    function scrapeSectionFromDOM(availableFolders) {
        try {
            const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, .accordion-header, .section-title, .breadcrumb, div[class*='header']"));
            let currentSection = "";
            let currentDifficulty = "";

            headings.forEach(el => {
                const txt = el.textContent || "";
                if (txt.includes("Arrays")) currentSection = "Arrays";
                else if (txt.includes("Basics")) currentSection = "Basics";
                else if (txt.includes("Sorting")) currentSection = "Sorting";
                else if (txt.includes("Binary Search")) currentSection = "Binary Search";
                else if (txt.includes("Linked List")) currentSection = "Linked List";
                else if (txt.includes("Stack")) currentSection = "Stack";
                else if (txt.includes("Trees")) currentSection = "Trees";

                if (txt.includes("Easy")) currentDifficulty = "easy";
                else if (txt.includes("Medium")) currentDifficulty = "medium";
                else if (txt.includes("Hard")) currentDifficulty = "hard";
            });

            if (currentSection === "Arrays") {
                if (currentDifficulty === "medium") return findFolder("03_Arrays/medium", availableFolders);
                if (currentDifficulty === "hard") return findFolder("03_Arrays/hard", availableFolders);
                return findFolder("03_Arrays/easy", availableFolders);
            }
            if (currentSection === "Sorting") return findFolder("02_Sorting", availableFolders);
        } catch (e) { }
        return null;
    }

    function findFolder(targetSubstr, folders) {
        const found = folders.find(f => f.toLowerCase().includes(targetSubstr.toLowerCase()));
        return found || folders[0] || "03_Arrays/easy";
    }

    function extractNotes() {
        // 1. Scrape TakeUForward & LeetCode DOM note elements
        const selectors = [
            "textarea[placeholder*='note']",
            "textarea[placeholder*='Note']",
            ".notes-section textarea",
            "#notes-textarea",
            ".note-input",
            ".note-card",
            "div[class*='note'] textarea",
            "div[class*='note-content']",
            "div[data-cy='note-content']",
            ".ant-drawer-body textarea"
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                const text = el.value || el.textContent;
                if (text && text.trim()) return text.trim();
            }
        }

        // 2. Scrape TakeUForward LocalStorage keys
        try {
            const title = extractProblemTitle().toLowerCase();
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes("note") || key.includes("sheet") || key.includes("tuf") || key.includes("a2z"))) {
                    const item = localStorage.getItem(key);
                    if (!item) continue;

                    // If simple text
                    if (item.length < 2000 && !item.startsWith("{") && !item.startsWith("[")) {
                        if (item.trim()) return item.trim();
                    }

                    // If JSON object mapping problem ID/title -> note text
                    try {
                        const parsed = JSON.parse(item);
                        if (typeof parsed === 'object' && parsed !== null) {
                            for (const [k, v] of Object.entries(parsed)) {
                                if (k.toLowerCase().includes(title) || title.includes(k.toLowerCase())) {
                                    if (typeof v === 'string' && v.trim()) return v.trim();
                                    if (typeof v === 'object' && v && v.note) return v.note.trim();
                                }
                            }
                        }
                    } catch (e) { }
                }
            }
        } catch (e) { }

        return "";
    }

})();
