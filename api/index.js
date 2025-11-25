const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(express.json());

const routes = [
        { path: '/', file: 'index.html' },
        { path: '/step_by_step_guide', file: 'guide.html' },
        { path: '/online_user', file: 'online.html' },
];

routes.forEach(route => {
        app.get(route.path, (req, res) => {
                res.sendFile(path.join(__dirname, '..', 'public', route.file));
        });
});

app.get('/commands', (req, res) => {
  try {
    const commandsPath = path.join(__dirname, '..', 'script', 'cmds');
    const eventsPath = path.join(__dirname, '..', 'script', 'events');

    const commands = fs.readdirSync(commandsPath)
      .filter(file => file.endsWith('.js') && !file.includes('.eg.') && !file.includes('.dev.'))
      .map(file => file.replace('.js', ''));

    const handleEvent = fs.readdirSync(eventsPath)
      .filter(file => file.endsWith('.js') && !file.includes('.eg.') && !file.includes('.dev.'))
      .map(file => file.replace('.js', ''));

    const aliases = commands.map(() => []);

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

                // Vercel can only show the web UI
                // To actually run the bot, user needs to:
                // 1. Copy this appstate
                // 2. Deploy to Railway/Render
                // 3. Set APPSTATE environment variable there
                
                res.status(200).json({
                        success: true,
                        message: 'Login data received successfully! ✅\n\nNOTE: This is the Vercel web interface - it cannot run the bot 24/7.\n\nTo run your bot:\n1. Copy your appstate JSON below\n2. Deploy to Railway (railway.app) or Render (render.com)\n3. Set APPSTATE environment variable with this JSON\n\nYour bot will then run 24/7! See DEPLOYMENT.md for step-by-step guide.',
                        appstate: state,
                        instructions: {
                                step1: 'Copy the appstate JSON from this response',
                                step2: 'Go to railway.app or render.com',
                                step3: 'Deploy this GitHub repository',
                                step4: 'Set APPSTATE environment variable',
                                step5: 'Your bot will start automatically!'
                        }
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

app.get('/info', (req, res) => {
        res.json([]);
});

module.exports = app;
