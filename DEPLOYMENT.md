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

## Vercel Deployment 🚀

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set Environment Variables (optional):
```bash
vercel env add APPSTATE
# Paste your appstate JSON string
```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration
5. (Optional) Add environment variable:
   - Go to Project Settings → Environment Variables
   - Add `APPSTATE` with your appstate JSON

### Method 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Railway Deployment 🚂

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy
5. (Optional) Add environment variables in Railway dashboard

## Render Deployment 🎨

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

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

## Note on Vercel Limitations

⚠️ **Important**: Vercel's serverless functions have a maximum execution time of 10 seconds on the free tier. This means:
- The web interface works perfectly ✅
- Login functionality works ✅
- Bot may disconnect after 10 seconds ⚠️

**Recommendation**: Use Railway, Render, or Replit for 24/7 bot hosting, or use Vercel just for the login interface.

## License

This project is open source and available under the MIT License.
