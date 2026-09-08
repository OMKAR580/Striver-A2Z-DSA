const express = require('express');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

// CORS Middleware for Chrome Extension & local cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DSA_ROOT = path.resolve(__dirname, '..');

// ========== GET ALL FOLDERS ==========
app.get('/api/folders', (req, res) => {
    try {
        const ignoreDirs = new Set(['.git', '.vscode', 'node_modules', 'dsa_ide', 'chrome_extension', '.agents', 'scratch', 'brain', 'pattern_question']);
        const folders = [];

        function scan(dir, relativePath = '') {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
                if (item.isDirectory() && !ignoreDirs.has(item.name)) {
                    const rel = relativePath ? `${relativePath}/${item.name}` : item.name;
                    folders.push(rel);
                    scan(path.join(dir, item.name), rel);
                }
            }
        }

        scan(DSA_ROOT);
        folders.sort();
        res.json({ success: true, folders });
    } catch (e) {
        res.json({ success: false, error: e.message, folders: [] });
    }
});

// ========== COMPILE & RUN ==========
app.post('/api/run', (req, res) => {
    const { code, input } = req.body;

    const timestamp = Date.now();
    const srcFile = path.join(os.tmpdir(), `dsa_${timestamp}.cpp`);
    const exeFile = path.join(os.tmpdir(), `dsa_${timestamp}.exe`);

    try {
        fs.writeFileSync(srcFile, code, 'utf8');
    } catch (e) {
        return res.json({ success: false, type: 'error', output: 'Failed to write temp file: ' + e.message });
    }

    // Step 1: Compile
    exec(`g++ "${srcFile}" -o "${exeFile}" 2>&1`, (compileErr, compileOut) => {
        if (compileErr) {
            cleanup(srcFile, exeFile);
            return res.json({ success: false, type: 'compile_error', output: compileOut || 'Compilation failed' });
        }

        // Step 2: Run with timeout
        const child = spawn(exeFile, [], { shell: false });
        let output = '';
        let errorOutput = '';
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            child.kill('SIGTERM');
        }, 10000);

        // Send stdin input
        if (input && input.trim()) {
            child.stdin.write(input + '\n');
        }
        child.stdin.end();

        child.stdout.on('data', d => { output += d.toString(); });
        child.stderr.on('data', d => { errorOutput += d.toString(); });

        child.on('close', (exitCode) => {
            clearTimeout(timer);
            cleanup(srcFile, exeFile);

            if (timedOut) {
                return res.json({ success: false, type: 'timeout', output: 'Time Limit Exceeded (10 seconds)' });
            }

            const finalOutput = output + (errorOutput || '');
            res.json({
                success: exitCode === 0,
                type: exitCode === 0 ? 'success' : 'runtime_error',
                output: finalOutput || (exitCode === 0 ? '(No output)' : 'Runtime error occurred')
            });
        });

        child.on('error', (err) => {
            clearTimeout(timer);
            cleanup(srcFile, exeFile);
            res.json({ success: false, type: 'error', output: 'Execution error: ' + err.message });
        });
    });
});

// ========== PUSH TO GITHUB & LOCAL ==========
app.post('/api/push', (req, res) => {
    let { code, filename, folder, questionTitle, questionUrl, language, notes, branch } = req.body;

    if (!code || !filename || !folder) {
        return res.json({ success: false, message: 'Missing required parameters (code, filename, folder).' });
    }

    const targetBranch = branch || (questionUrl && questionUrl.includes('leetcode.com') ? 'leetcode' : 'main');

    // Ensure extension
    const ext = path.extname(filename) || '.cpp';
    if (!filename.endsWith(ext)) {
        filename += ext;
    }

    // Format metadata header if not already present
    let formattedCode = code;
    if (questionTitle || questionUrl) {
        const commentPrefix = (ext === '.py') ? '#' : '//';
        const dateStr = new Date().toISOString().split('T')[0];
        const header = [
            `${commentPrefix} ========================================================`,
            `${commentPrefix} Problem: ${questionTitle || filename}`,
            questionUrl ? `${commentPrefix} Link: ${questionUrl}` : null,
            `${commentPrefix} Date: ${dateStr}`,
            `${commentPrefix} Striver's A2Z DSA Sheet Solution`,
            `${commentPrefix} ========================================================\n\n`
        ].filter(Boolean).join('\n');

        if (!code.includes('Problem:') && !code.includes('Striver')) {
            formattedCode = header + code;
        }
    }

    const folderParts = folder.split('/').filter(Boolean);
    const targetDir = path.join(DSA_ROOT, ...folderParts);
    const targetFile = path.join(targetDir, filename);
    const relFilePath = path.relative(DSA_ROOT, targetFile).replace(/\\/g, '/');
    const commitMsg = questionTitle 
        ? `Add solution: ${questionTitle} (${relFilePath})` 
        : `Add solution: ${filename}`;

    let notesSaved = false;

    try {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // 1. Write Code File (Pushed to GitHub)
        fs.writeFileSync(targetFile, formattedCode, 'utf8');

        // 2. Write Personal Notes File (Saved locally ONLY, ignored by Git)
        if (notes && notes.trim()) {
            const baseNameNoExt = filename.substring(0, filename.length - ext.length);
            const notesFilename = `${baseNameNoExt}.notes.md`;
            const notesPath = path.join(targetDir, notesFilename);
            const dateStr = new Date().toISOString().split('T')[0];

            const notesContent = [
                `# 📝 Personal Notes: ${questionTitle || baseNameNoExt}`,
                `> **Date**: ${dateStr}`,
                questionUrl ? `> **Link**: ${questionUrl}` : null,
                `\n## Key Intuition & Remarks:\n`,
                notes.trim(),
                `\n---\n*Saved locally in ${relFilePath.replace(filename, notesFilename)} (Ignored by Git)*`
            ].filter(Boolean).join('\n');

            fs.writeFileSync(notesPath, notesContent, 'utf8');
            notesSaved = true;
        }
    } catch (e) {
        return res.json({ success: false, message: 'File save failed: ' + e.message });
    }

    // Git: Handle target branch (leetcode vs main)
    exec(`cd /d "${DSA_ROOT}" && git rev-parse --abbrev-ref HEAD`, { shell: 'cmd.exe' }, (branchErr, branchStdout) => {
        const originalBranch = (branchStdout || 'main').trim() || 'main';

        const gitCmd = `cd /d "${DSA_ROOT}" && (git checkout ${targetBranch} 2>nul || git checkout -b ${targetBranch}) && git add "${targetFile}" && git commit -m "${commitMsg.replace(/"/g, '\\"')}" && git push origin ${targetBranch} && git checkout ${originalBranch}`;

        exec(gitCmd, { shell: 'cmd.exe', timeout: 45000 }, (err, stdout, stderr) => {
            // Re-ensure local file is present on disk in local workspace
            try {
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
                fs.writeFileSync(targetFile, formattedCode, 'utf8');
            } catch(e){}

            const notesStatusMsg = notesSaved ? '\n📝 Notes: Saved locally (.notes.md)' : '';

            if (err) {
                const msg = stderr || stdout || err.message || '';
                if (msg.includes('nothing to commit') || stdout.includes('nothing to commit') || msg.includes('Everything up-to-date')) {
                    return res.json({ 
                        success: true,
                        localSaved: true,
                        notesSaved: notesSaved,
                        gitPushed: true,
                        relFilePath: relFilePath,
                        branch: targetBranch,
                        message: `Saved locally! Already up to date on GitHub (${targetBranch} branch).\n📁 ${relFilePath}${notesStatusMsg}` 
                    });
                }
                return res.json({ 
                    success: true, 
                    localSaved: true,
                    notesSaved: notesSaved,
                    gitPushed: false,
                    relFilePath: relFilePath,
                    branch: targetBranch,
                    message: `Saved locally to ${relFilePath}!${notesStatusMsg}\n(Git push notice: ${stderr.trim() || err.message})` 
                });
            }

            res.json({
                success: true,
                localSaved: true,
                notesSaved: notesSaved,
                gitPushed: true,
                relFilePath: relFilePath,
                branch: targetBranch,
                message: `Code pushed successfully to branch '${targetBranch}'! 🚀\n📁 ${relFilePath}\n💬 Commit: ${commitMsg}${notesStatusMsg}`
            });
        });
    });
});

// ========== CHECK GIT STATUS ==========
app.get('/api/git-status', (req, res) => {
    exec(`cd /d "${DSA_ROOT}" && git log --oneline -1`, { shell: 'cmd.exe' }, (err, stdout) => {
        if (err) {
            return res.json({ initialized: false, dsaRoot: DSA_ROOT });
        }
        res.json({ initialized: true, lastCommit: stdout.trim(), dsaRoot: DSA_ROOT });
    });
});

function cleanup(...files) {
    files.forEach(f => {
        try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (e) { }
    });
}

const PORT = 3456;
app.listen(PORT, () => {
    console.log('\n\x1b[32m  ✅ DSA Sync Backend Server is running!\x1b[0m');
    console.log(`\x1b[36m  📱 Local IDE / API: http://localhost:${PORT}\x1b[0m`);
    console.log('\x1b[33m  Press Ctrl+C to stop\x1b[0m\n');
});

