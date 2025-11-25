process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require("axios");
const { login } = require('@dongdev/fca-unofficial');

// ========== LOAD GOATBOT MODULES ========== //
const log = require('./logger/log.js');

// ========== INITIALIZE GLOBAL GOATBOT ========== //
const dirConfig = path.normalize(`${__dirname}/config.json`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands.json`);

function validJSON(pathDir) {
        try {
                if (!fs.existsSync(pathDir))
                        throw new Error(`File "${pathDir}" not found`);
                JSON.parse(fs.readFileSync(pathDir, 'utf8'));
                return true;
        }
        catch (err) {
                throw new Error(err.message);
        }
}

for (const pathDir of [dirConfig, dirConfigCommands]) {
        try {
                validJSON(pathDir);
        }
        catch (err) {
                log.error("CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message}`);
                process.exit(0);
        }
}

const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

global.GoatBot = {
        startTime: Date.now() - process.uptime() * 1000,
        commands: new Map(),
        eventCommands: new Map(),
        commandFilesPath: [],
        eventCommandsFilesPath: [],
        aliases: new Map(),
        onFirstChat: [],
        onChat: [],
        onEvent: [],
        onReply: new Map(),
        onReaction: new Map(),
        onAnyEvent: [],
        config,
        configCommands,
        envCommands: {},
        envEvents: {},
        envGlobal: {},
        reLoginBot: function () { },
        Listening: null,
        oldListening: [],
        callbackListenTime: {},
        storage5Message: [],
        fcaApi: null,
        botID: null
};

global.db = {
        allThreadData: [],
        allUserData: [],
        allDashBoardData: [],
        allGlobalData: [],
        threadModel: null,
        userModel: null,
        dashboardModel: null,
        globalModel: null,
        threadsData: null,
        usersData: null,
        dashBoardData: null,
        globalData: null,
        receivedTheFirstMessage: {}
};

global.client = {
        dirConfig,
        dirConfigCommands,
        countDown: {},
        cache: {},
        database: {
                creatingThreadData: [],
                creatingUserData: [],
                creatingDashBoardData: [],
                creatingGlobalData: []
        },
        commandBanned: configCommands.commandBanned || {}
};

// Load utils after GoatBot is initialized
const utils = require('./utils.js');
global.utils = utils;

global.temp = {
        createThreadData: [],
        createUserData: [],
        createSingleData: [],
        createThreadDataError: [],
        oldApiMessages: {},
        contentFileEvent: {},
        contentScripts: {
                cmds: {},
                events: {}
        }
};

// Set env configs from configCommands (like in Goat.js lines 184-186)
global.GoatBot.envGlobal = global.GoatBot.configCommands.envGlobal || {};
global.GoatBot.envCommands = global.GoatBot.configCommands.envCommands || {};
global.GoatBot.envEvents = global.GoatBot.configCommands.envEvents || {};

// ========== ACCOUNT MANAGER ========== //
const activeAccounts = new Map();

// ========== EXPRESS SERVER ========== //
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());

const routes = [
        { path: '/', file: 'index.html' },
        { path: '/step_by_step_guide', file: 'guide.html' },
        { path: '/online_user', file: 'online.html' },
];

routes.forEach(route => {
        app.get(route.path, (req, res) => {
                res.sendFile(path.join(__dirname, 'public', route.file));
        });
});

app.get('/info', (req, res) => {
        const data = Array.from(activeAccounts.values()).map(account => ({
                name: account.name,
                profileUrl: account.profileUrl,
                thumbSrc: account.thumbSrc,
                time: account.time
        }));
        res.json(JSON.parse(JSON.stringify(data, null, 2)));
});

app.get('/commands', (req, res) => {
  try {
    const commandsPath = path.join(__dirname, 'script', 'cmds');
    const eventsPath = path.join(__dirname, 'script', 'events');

    // Get commands
    const commands = fs.readdirSync(commandsPath)
      .filter(file => file.endsWith('.js') && !file.includes('.eg.') && !file.includes('.dev.'))
      .map(file => file.replace('.js', ''));

    // Get events
    const handleEvent = fs.readdirSync(eventsPath)
      .filter(file => file.endsWith('.js') && !file.includes('.eg.') && !file.includes('.dev.'))
      .map(file => file.replace('.js', ''));

    // Create empty aliases array for each command
    const aliases = commands.map(() => []);

    console.log('Commands loaded:', commands.length);
    console.log('Events loaded:', handleEvent.length);

    res.json({ commands, handleEvent, aliases });
  } catch (error) {
    console.error('Error loading commands/events:', error);
    res.status(500).json({ 
      commands: [], 
      handleEvent: [], 
      aliases: [],
      error: error.message 
    });
  }
});

app.post('/login', async (req, res) => {
        const { state, commands, prefix, admin, devUid, botName, premiumUid } = req.body;

        try {
                if (!state) {
                        throw new Error('Missing app state data');
                }

                const cUser = state.find(item => item.key === 'c_user');
                if (!cUser) {
                        return res.status(400).json({
                                error: true,
                                message: "Invalid appstate data"
                        });
                }

                if (activeAccounts.has(cUser.value)) {
                        return res.status(400).json({
                                error: false,
                                message: "User already logged in",
                                user: activeAccounts.get(cUser.value)
                        });
                }

                // Store appstate in memory only - no file writing for multi-bot support
                console.log('✓ Appstate stored in memory (no file created)');

                // Add dev UID, bot name and premium UID configuration logic
                const config = JSON.parse(JSON.stringify(global.GoatBot.config));
                config.prefix = prefix !== 'non-prefix' ? prefix : config.prefix;

                // Handle admin as string or array
                const adminArray = Array.isArray(admin) ? admin : (admin && admin !== 'default' ? [admin] : []);
                adminArray.forEach(adminId => {
                  if (adminId && adminId.trim() !== '' && !config.adminBot.includes(adminId.trim())) {
                    config.adminBot.push(adminId.trim());
                  }
                });

                // Add dev UID if provided
                if (devUid && devUid.trim() !== '') {
                  if (!config.devUsers) {
                    config.devUsers = [];
                  }
                  if (!config.devUsers.includes(devUid)) {
                    config.devUsers.push(devUid);
                  }
                }

                // Add premium UID if provided
                if (premiumUid && premiumUid.trim() !== '') {
                  if (!config.premiumUsers) {
                    config.premiumUsers = [];
                  }
                  if (!config.premiumUsers.includes(premiumUid)) {
                    config.premiumUsers.push(premiumUid);
                  }
                }

                // Set bot name if provided
                if (botName && botName.trim() !== '') {
                  config.nickNameBot = botName;
                }

                // Update global config instead of writing to file (Vercel compatible)
                global.GoatBot.config = config;
                
                // Only save to file if not in Vercel environment
                if (!process.env.VERCEL) {
                        try {
                                fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
                        } catch (err) {
                                console.log('Warning: Could not save config.json (read-only filesystem)');
                        }
                }

                // Pass the sanitized admin array (not the original string)
                await accountLogin(state, commands, prefix, config.adminBot);
                res.status(200).json({
                        success: true,
                        message: 'Login successful'
                });
        }
        catch (error) {
                console.error(error);
                res.status(400).json({
                        error: true,
                        message: error.message
                });
        }
});

app.listen(5000, '0.0.0.0', () => {
        console.log(`Server is running at http://localhost:5000`);
});

// ========== ACCOUNT LOGIN FUNCTION ========== //
async function accountLogin(state, enableCommands = [], prefix, admins = []) {
        return new Promise(async (resolve, reject) => {
                login({ appState: state }, async (error, api) => {
                        if (error) {
                                reject(error);
                                return;
                        }

                        try {
                                const userid = await api.getCurrentUserID();
                                const userInfo = await api.getUserInfo(userid);

                                if (!userInfo || !userInfo[userid]) {
                                        throw new Error('Unable to get account info');
                                }

                                const { name, profileUrl, thumbSrc } = userInfo[userid];

                                activeAccounts.set(userid, {
                                        name,
                                        profileUrl,
                                        thumbSrc,
                                        time: 0,
                                        api
                                });

                                const intervalId = setInterval(() => {
                                        const account = activeAccounts.get(userid);
                                        if (!account) {
                                                clearInterval(intervalId);
                                                return;
                                        }
                                        activeAccounts.set(userid, {
                                                ...account,
                                                time: account.time + 1
                                        });
                                }, 1000);

                                // Set FCA options
                                api.setOptions({
                                        listenEvents: config.fcaOption?.listenEvents !== false,
                                        logLevel: config.fcaOption?.logLevel || "silent",
                                        updatePresence: config.fcaOption?.updatePresence !== false,
                                        selfListen: config.fcaOption?.selfListen !== false,
                                        forceLogin: config.fcaOption?.forceLogin !== false,
                                        online: config.fcaOption?.online !== false,
                                        autoMarkDelivery: config.fcaOption?.autoMarkDelivery === true,
                                        autoMarkRead: config.fcaOption?.autoMarkRead === true
                                });

                                global.GoatBot.fcaApi = api;
                                global.GoatBot.botID = userid;

                                // Apply HTML login settings to bot config
                                if (prefix && prefix !== 'non-prefix') {
                                        global.GoatBot.config.prefix = prefix;
                                }
                                
                                // Only update admin list if it's a valid array with values
                                if (Array.isArray(admins) && admins.length > 0) {
                                        global.GoatBot.config.adminBot = admins;
                                }

                                // Initialize database and load all scripts
                                const { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData } = await initDatabase(api);

                                // Setup relogin function
                                global.GoatBot.reLoginBot = function () {
                                        accountLogin(state, enableCommands, prefix, admins);
                                };

                                // Start listening with handler
                                const handlerAction = require('./handler/handlerAction.js')(
                                        api, 
                                        threadModel, 
                                        userModel, 
                                        dashBoardModel, 
                                        globalModel, 
                                        usersData, 
                                        threadsData, 
                                        dashBoardData, 
                                        globalData
                                );

                                const handlerWhenListenHasError = require('./login/handlerWhenListenHasError.js');
                                
                                // Start listening to messages
                                global.GoatBot.Listening = api.listenMqtt((err, event) => {
                                        if (err) {
                                                console.error('Listen error:', err);
                                                return handlerWhenListenHasError({ api, error: err });
                                        }
                                        handlerAction(event);
                                });

                                log.info('LOGIN', `Logged in as ${name} (${userid})`);
                                resolve();
                        }
                        catch (err) {
                                reject(err);
                        }
                });
        });
}

// ========== INITIALIZE DATABASE AND LOAD SCRIPTS ========== //
async function initDatabase(api) {
        if (global.db.threadModel) return global.db;

        function createLine(content) {
                return content ? `─────── ${content} ───────` : '──────────────────────';
        }

        // Use Goatbot's loadData.js to properly initialize database
        const { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize } = await require('./login/loadData.js')(api, createLine);

        // Now load all scripts using Goatbot's loadScripts.js
        await require('./login/loadScripts.js')(api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, createLine);

        return { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData };
}

// ========== AUTO LOAD APPSTATE IF EXISTS ========== //
async function autoLoadAppState() {
        // Only use environment variable if set (for Vercel deployment)
        if (process.env.APPSTATE) {
                try {
                        console.log('Found APPSTATE environment variable, attempting auto-login...');
                        let appState;
                        
                        try {
                                appState = JSON.parse(process.env.APPSTATE);
                        } catch (parseError) {
                                try {
                                        appState = JSON.parse(JSON.parse(process.env.APPSTATE));
                                } catch (e) {
                                        throw new Error('APPSTATE environment variable is not valid JSON.');
                                }
                        }
                        
                        if (appState && Array.isArray(appState) && appState.length > 0) {
                                const cUser = appState.find(item => item.key === 'c_user');
                                if (cUser && !activeAccounts.has(cUser.value)) {
                                        await accountLogin(appState, [], null, []);
                                        console.log('Auto-login from environment variable successful!');
                                        return;
                                }
                        }
                } catch (error) {
                        console.error('Auto-login from environment variable failed:', error.message);
                }
        }
        
        // Skip appstate.json file - use HTML interface only
        console.log('╔════════════════════════════════════════════════════╗');
        console.log('║  Please login via the web interface               ║');
        console.log('║  http://localhost:5000                             ║');
        console.log('║  You can run multiple bots by logging in again    ║');
        console.log('╚════════════════════════════════════════════════════╝');
}

// ========== START MAIN ========== //
async function main() {
        console.log('Auto Bot with Goatbot Integration Started!');
        console.log('Web interface available at http://localhost:5000');
        
        setTimeout(() => {
                autoLoadAppState();
        }, 2000);
}

main();