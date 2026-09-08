// Striver DSA Sync - Page Context Script (MAIN World)
(function () {
    window.addEventListener("STRIVER_SYNC_REQUEST_PAGE_CODE", function (event) {
        const requestId = event.detail ? event.detail.requestId : null;
        let code = null;
        let source = null;

        try {
            // 1. Monaco Editor (Used by TakeUForward, LeetCode, GFG)
            if (window.monaco && window.monaco.editor) {
                const models = window.monaco.editor.getModels();
                if (models && models.length > 0) {
                    let bestModelCode = "";
                    for (const m of models) {
                        const val = m.getValue();
                        if (val && val.length > bestModelCode.length) {
                            bestModelCode = val;
                        }
                    }
                    if (bestModelCode && bestModelCode.trim().length > 0) {
                        code = bestModelCode;
                        source = "monaco-model";
                    }
                }
            }

            // 2. CodeMirror Instances (Used by GFG, Code360)
            if (!code) {
                const cmElems = document.querySelectorAll(".CodeMirror");
                for (const cmElem of cmElems) {
                    if (cmElem.CodeMirror && typeof cmElem.CodeMirror.getValue === "function") {
                        const val = cmElem.CodeMirror.getValue();
                        if (val && val.trim().length > (code ? code.length : 0)) {
                            code = val;
                            source = "codemirror-instance";
                        }
                    }
                }
            }

            // 3. LeetCode / Global monacoEditor fallback
            if (!code && window.monacoEditor && typeof window.monacoEditor.getValue === "function") {
                code = window.monacoEditor.getValue();
                source = "monacoEditor-global";
            }
        } catch (e) {
            console.error("[Striver Sync PageScript Error]", e);
        }

        window.dispatchEvent(new CustomEvent("STRIVER_SYNC_RESPONSE_PAGE_CODE", {
            detail: {
                requestId: requestId,
                code: code,
                source: source
            }
        }));
    });
})();
