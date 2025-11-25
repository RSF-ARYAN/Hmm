const { spawn } = require("child_process");
const path = require('path');
const { exec } = require('child_process');

const SCRIPT_FILE = "auto.js";
const SCRIPT_PATH = path.join(__dirname, SCRIPT_FILE);

// Kill any process using port 5000 before starting
function killPort5000(callback) {
    exec("lsof -ti:5000 | xargs kill -9 2>/dev/null || true", (error) => {
        // Ignore errors, just continue
        setTimeout(callback, 500);
    });
}

function start() {
    killPort5000(() => {
        const main = spawn("node", [SCRIPT_PATH], {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        });

        main.on("close", (exitCode) => {
            if (exitCode === 0) {
                console.log("Main process exited with code 0");
            } else if (exitCode === 1) {
                console.log("Main process exited with code 1. Restarting...");
                start();
            } else {
                console.error(`Main process exited with code ${exitCode}`);
            }
        });
    });
}

start();

