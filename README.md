# 🤖 Auto Facebook Messenger Bot

A powerful Facebook Messenger bot with 91+ commands, no `appstate.json` file required!

## ✨ Features

- ✅ **No appstate.json needed** - Login via HTML interface
- ✅ **91+ Commands** - GPT, avatar, games, utilities, and more
- ✅ **8 Event Handlers** - Welcome, leave, auto-update, spam detection
- ✅ **Easy Deployment** - Works on Railway, Render, Replit, or local
- ✅ **Environment Variable Support** - Secure credential storage
- ✅ **Web Interface** - Beautiful login and command selection UI

## 🚀 Quick Start

### Local Development

1. **Clone and Install**
```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

2. **Run the Bot**
```bash
npm start
```

3. **Open Web Interface**
```
http://localhost:5000
```

4. **Login**
- Get your Facebook cookies (see [DEPLOYMENT.md](DEPLOYMENT.md))
- Paste into the web interface
- Select commands and submit
- Bot starts automatically! 🎉

## 🌐 Deployment Options

| Platform | Setup Time | 24/7 Bot | Free Tier | Recommended |
|----------|-----------|----------|-----------|-------------|
| **Railway** | 2 min | ✅ | $5/month | ⭐⭐⭐⭐⭐ |
| **Render** | 3 min | ✅ | 750h/month | ⭐⭐⭐⭐⭐ |
| **Vercel** | 1 min | ❌ | Unlimited | ⭐⭐⭐ (UI only) |
| **Replit** | 1 min | ✅ | Limited | ⭐⭐⭐⭐ |

### Recommended: Deploy to Railway or Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions for each platform.

## 📝 Commands

The bot includes 91+ commands organized by category:

- **AI & Chat**: `gpt`, `nijix` - AI conversation
- **Utilities**: `avatar`, `uid`, `tid` - User information
- **Fun**: `emojimix`, `guessnumber` - Games and entertainment
- **Admin**: `ban`, `kick`, `warn` - Moderation tools
- **Info**: `help`, `count`, `rank` - Bot information

Type `!help` to see all commands (prefix can be customized).

## 🔧 Environment Variables

Optional environment variables for advanced configuration:

```bash
APPSTATE=<your-facebook-cookies-json>  # For auto-login
BOT_PREFIX=!                           # Command prefix
ADMIN_UIDS=123456789,987654321        # Admin user IDs
BOT_NAME=My Awesome Bot                # Bot's nickname
```

## 🛠️ Configuration

Edit `config.json` to customize:

- Bot prefix
- Admin users
- Premium users
- Database type (SQLite/MongoDB)
- Auto-restart settings
- Event logging
- And more!

## 📖 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide for all platforms
- [.env.example](.env.example) - Environment variable examples

## 🐛 Troubleshooting

### Bot not responding?
- Check if you're logged in via the web interface
- Verify console logs for errors
- Make sure your cookies are fresh

### Deployment failed?
- For Vercel: Remember it only hosts the web UI, not the 24/7 bot
- For Railway/Render: Check build logs for errors
- Ensure all dependencies are in package.json

### Login failed?
- Use fresh Facebook cookies (less than 24 hours old)
- Check if your account has 2FA enabled
- Try logging out and back into Facebook

## 📜 License

MIT License - feel free to use and modify!

## 🙏 Credits

- Built on top of [GoatBot V2](https://github.com/ntkhang03/Goat-Bot-V2) by NTKhang
- Uses [@dongdev/fca-unofficial](https://www.npmjs.com/package/@dongdev/fca-unofficial) for Facebook API

## 💡 Notes

⚠️ **Important**: This bot uses unofficial Facebook API methods. Use at your own risk. We recommend:
- Using a dummy/test Facebook account
- Not using your main personal account
- Following Facebook's Terms of Service

## 🤝 Contributing

Contributions welcome! Feel free to open issues or pull requests.

---

**Need Help?** Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide or open an issue!
