# Deployment Guide

এই Facebook Messenger Bot টি Vercel বা অন্য যেকোনো hosting platform এ deploy করার জন্য তৈরি করা হয়েছে।

## Features ✨

- ✅ No `appstate.json` file required
- ✅ HTML-based login interface
- ✅ Works on Vercel, Railway, Render, or any Node.js host
- ✅ Environment variable support
- ✅ Auto-login from browser cookies
- ✅ 60+ built-in commands
- ✅ Event handlers (welcome, leave, etc.)

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Bot
```bash
npm start
```
or
```bash
node index.js
```

### 3. Open Web Interface
Open your browser and go to: `http://localhost:5000`

### 4. Login
1. Open Facebook in your browser
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Paste this code to get your cookies:
```javascript
copy(JSON.stringify(document.cookie.split('; ').reduce((acc, cookie) => {
  const [key, value] = cookie.split('=');
  acc.push({
    key: key,
    value: value,
    domain: '.facebook.com',
    path: '/',
    hostOnly: false,
    creation: new Date().toISOString(),
    lastAccessed: new Date().toISOString()
  });
  return acc;
}, [])))
```
5. Paste the copied JSON into the textarea on the web interface
6. Select commands and click Submit

## Vercel Deployment 🌐 (Web Interface Only)

⚠️ **Important**: Vercel can only host the **web interface** for logging in. For 24/7 bot operation, use Railway or Render (see below).

### What Vercel Provides:
- ✅ Beautiful web interface for login
- ✅ Cookie/appstate input form
- ✅ Command selection UI
- ❌ Does NOT run the bot 24/7 (use Railway/Render for that)

### Deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Vercel will automatically detect and deploy

Your web interface will be live at `https://your-project.vercel.app`

**Note**: After you login via Vercel UI, copy your appstate JSON and deploy to Railway/Render for 24/7 operation.

## Railway Deployment 🚂 (RECOMMENDED for 24/7 Bot)

✅ **Best for**: Running the bot 24/7 with full functionality

### Deploy to Railway:

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy
5. Your bot will start automatically!

### After Deployment:

1. Open your Railway app URL (e.g., `https://your-bot.railway.app`)
2. Login via the web interface
3. Bot will stay online 24/7!

### Optional Environment Variables:
- `APPSTATE` - Pre-load your appstate for auto-login on restart
- `BOT_PREFIX` - Custom command prefix
- `ADMIN_UIDS` - Admin user IDs

**Free Tier**: Railway provides $5/month free credit, enough for running the bot!

## Render Deployment 🎨 (RECOMMENDED for 24/7 Bot)

✅ **Best for**: Free 24/7 hosting with automatic deploys

### Deploy to Render:

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Name**: your-bot-name
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"

### After Deployment:

1. Wait for build to complete (~2-3 minutes)
2. Open your Render app URL (e.g., `https://your-bot.onrender.com`)
3. Login via the web interface
4. Bot runs 24/7 automatically!

**Free Tier**: Render provides free hosting with 750 hours/month!

## Environment Variables (Optional)

You can set these in your hosting platform's dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `APPSTATE` | Facebook cookies in JSON format | No (can login via web UI) |
| `BOT_PREFIX` | Command prefix (default: !) | No |
| `ADMIN_UIDS` | Admin user IDs (comma separated) | No |
| `BOT_NAME` | Bot's nickname | No |

## How to Get AppState

### Option 1: Web Interface (Recommended)
1. Visit your deployed bot URL
2. Follow the login instructions on the page
3. Bot will automatically start after login

### Option 2: Browser Console
1. Login to Facebook in your browser
2. Open Developer Tools (F12)
3. Go to Console
4. Run the cookie extraction code (see Local Development section)
5. Copy the output and set it as `APPSTATE` environment variable

### Option 3: Using C3C FBState Tool
```bash
npm install -g c3c-fbstate
c3c-fbstate
```

## Commands

The bot comes with 60+ built-in commands including:
- `help` - Show all commands
- `gpt` - AI chatbot
- `avatar` - Get user avatar
- `balance` - Check balance
- `rank` - Show user rank
- And many more...

## Events

The bot handles these events:
- Welcome messages when users join
- Leave messages when users leave
- Auto-update thread info
- Spam detection
- Warning system
- Bot logs

## Troubleshooting

### Bot not responding?
- Check if you're logged in via the web interface
- Verify your appstate is valid
- Check console logs for errors

### Vercel timeout?
- Vercel has a 10-second timeout for serverless functions
- For long-running bots, use Railway or Render instead
- Or use Vercel just for the web interface

### Login failed?
- Make sure you're using fresh cookies
- Try logging out and back into Facebook
- Check if your account has 2FA enabled

## Support

For issues or questions, please check the console logs first. Most errors will show there with helpful messages.

## Platform Comparison

| Platform | Web Interface | 24/7 Bot | Free Tier | Best For |
|----------|---------------|----------|-----------|----------|
| **Railway** | ✅ | ✅ | $5/month credit | 24/7 bot hosting |
| **Render** | ✅ | ✅ | 750 hours/month | Free 24/7 hosting |
| **Vercel** | ✅ | ❌ | Unlimited | Web UI only |
| **Replit** | ✅ | ✅ | Limited hours | Development & testing |

### Recommended Setup:

**Option 1** (Best): Deploy to **Railway** or **Render** for everything
- One deployment handles both web UI and bot ✅

**Option 2** (Advanced): Split deployment
- **Vercel**: Web interface only (login page)
- **Railway/Render**: Bot operation 24/7
- User logs in on Vercel, copies appstate, sets in Railway/Render env vars

## Why Vercel Can't Run the Bot 24/7

Vercel uses serverless functions that:
- Have 10-second maximum execution time
- Cannot maintain persistent connections (like Facebook MQTT)
- Restart between requests

The bot needs:
- Continuous connection to Facebook Messenger
- Long-running MQTT listener
- Persistent state management

→ **Solution**: Use Railway or Render for the bot!

## License

This project is open source and available under the MIT License.
