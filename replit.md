# Goat Bot V2 - Facebook Messenger Bot

## Overview

Goat Bot V2 is a Facebook Messenger chatbot framework built on Node.js that enables automated interactions through Facebook's messaging platform. Originally created by NTKhang and enhanced by NeoKEX, this bot provides a modular command system, role-based permissions, premium features, and extensive customization options. The bot operates by logging into a Facebook account and listening for messages via the unofficial Facebook Chat API, then responding with commands, events, and automated behaviors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Application Structure

**Entry Point & Process Management**
- `index.js` spawns `auto.js` (or `Goat.js` in the Goatbot-updated version) as a child process
- Automatic restart on exit code 1 for fault tolerance
- Global error handlers for unhandled rejections and uncaught exceptions

**Modular Plugin System**
- Commands stored in `scripts/cmds/` directory with hot-reload support
- Event handlers in `scripts/events/` for message lifecycle management
- Dynamic command loading at startup with dependency checking via `loadScripts.js`
- Plugin configuration isolated in `configCommands.json`
- Aliases system allows multiple command names pointing to the same handler

**Authentication & Session Management**
- Facebook authentication via multiple methods:
  - Cookie-based login from `account.txt` or `appstate.json`
  - Email/password authentication with optional 2FA (TOTP generator)
  - Fallback to mbasic login method when needed
- Uses `@dongdev/fca-unofficial` library for Facebook Chat API integration
- Automatic cookie refresh on configurable intervals (default 1440 minutes)
- Session persistence across bot restarts
- Cookie validation via `checkLiveCookie.js` before use
- Checkpoint detection and graceful error handling for restricted accounts

**Role-Based Permission System**
- 5-tier hierarchy:
  - **Role 0**: Regular users
  - **Role 1**: Group administrators
  - **Role 2**: Bot administrators (adminBot array)
  - **Role 3**: Premium users (premiumUsers array with optional time expiration)
  - **Role 4**: Developers (devUsers array - highest permission)
- Per-command role requirements configurable in command metadata
- Money-based gating: commands can require minimum balance independent of role
- Time-based premium access with automatic expiration checking
- Developer exclusive permissions (shell execution, eval, message unsend via reactions)

**Data Storage Layer**
- Multi-database support: JSON, SQLite (default), or MongoDB
- Unified data controller abstraction in `database/controller/`
- Separate models for threads, users, dashboard, and global data
- Auto-sync capability to refresh thread/user information from Facebook
- SQLite uses Sequelize ORM for relational data management
- MongoDB uses Mongoose for document-based storage
- Automatic data creation when new users/threads interact with bot

**Message Handling Pipeline**
1. Event received via MQTT listener (`fb-chat-api`)
2. Database validation ensures thread/user records exist (`handlerCheckData.js`)
3. Event routing based on type (message, reaction, event, presence)
4. Command parsing with prefix matching and alias resolution
5. Permission checks (role, money, cooldown, whitelist)
6. Command execution with error handling and logging
7. Reply/reaction handling with message tracking

**Command Configuration System**
- Each command defines metadata: name, aliases, role requirements, cooldown, money requirements
- Global environment variables in `configCommands.json` (API keys, etc.)
- Per-command environment variables for customization
- Command banning system to disable specific commands
- Support for both chat commands and event-triggered handlers

**Express Web Server** (Dashboard)
- Optional web dashboard for bot management
- Authentication with Passport.js (local strategy with bcrypt)
- Session management with express-session
- File upload capabilities for media handling
- Rate limiting to prevent abuse
- Socket.IO integration for real-time updates
- Serves static files from `public/` directory
- ETA templating engine for dynamic pages

**Internationalization**
- Language files in `languages/` directory (`.lang` format)
- Support for English and Vietnamese (extensible)
- getText() utility for multi-language string retrieval
- Language selection via `config.json`

**Logging & Monitoring**
- Custom logging system with color-coded output
- Timestamp formatting with moment-timezone
- Separate loggers for normal output (`log.js`) and loading states (`loading.js`)
- Log levels: error, warn, info, success, master
- Optional auto-uptime checking with external service integration

**Safety & Moderation Features**
- Anti-inbox mode to block private messages
- Whitelist mode for user IDs and thread IDs
- Admin-only mode to restrict bot to administrators
- Command cooldown system to prevent spam
- Error handling with graceful degradation

**Deployment Configuration**
- Docker support with optimized Dockerfile
- Vercel deployment configuration (`vercel.json`)
- Railway deployment configuration (`railway.json`)
- Replit compatibility with uptime monitoring
- Environment variable support for sensitive data

## External Dependencies

### Core Facebook Integration
- **@dongdev/fca-unofficial** (v2.0.32): Unofficial Facebook Chat API for login and message handling
- **neokex-fca** (v4.5.1): Alternative Facebook Chat API implementation
- **mqtt** (v3.0.0/v4.3.7): MQTT client for Facebook's real-time messaging protocol
- **websocket-stream** (v5.5.0): WebSocket streaming for persistent connections

### Web Server & API
- **express** (v4.18.1-4.18.2): Web application framework for dashboard
- **body-parser** (v1.20.2): Request body parsing middleware
- **express-session** (v1.17.3-1.18.2): Session management
- **cookie-parser** (v1.4.6): Cookie parsing for authentication
- **express-fileupload** (v1.4.0): File upload handling
- **express-rate-limit** (v6.5.2): Rate limiting for API endpoints
- **socket.io** (v4.5.1-4.8.1): Real-time bidirectional communication
- **eta** (v1.12.3-4.4.1): Templating engine for views
- **passport** (v0.6.0-0.7.0): Authentication middleware
- **passport-local** (v1.0.0): Local authentication strategy
- **connect-flash** (v0.1.1): Flash messages for sessions

### Database
- **sqlite3** (v5.0.5-5.1.7): Default SQLite database driver
- **sequelize** (v6.19.0-6.37.7): ORM for relational databases
- **mongoose** (v6.3.1): MongoDB object modeling

### HTTP & External Services
- **axios** (v1.4.0-1.6.5): HTTP client for API requests
- **request** (v2.53.0-2.88.2): HTTP request library (legacy support)
- **https-proxy-agent** (v4.0.0): HTTPS proxy support

### Media Processing
- **canvas** (v3.2.0): Image manipulation and generation
- **jimp** (v1.6.0): JavaScript image processing library
- **qrcode-reader** (v1.0.4): QR code scanning
- **cheerio** (v0.22.0-1.0.0-rc.12): HTML parsing (jQuery-like API)

### Video & Audio
- **ytdl-core** (v4.11.4): YouTube video downloader
- **@distube/ytdl-core** (v4.13.3): Enhanced YouTube downloader
- **yt-search** (v2.10.4): YouTube search functionality
- **btch-downloader** (v6.0.22): Batch media downloader

### AI & Content Generation
- **hercai** (v12.2.0): AI chatbot integration

### Utilities
- **fs-extra** (v11.1.0-11.1.1): Enhanced file system operations
- **moment-timezone** (v0.5.34-0.6.0): Date/time manipulation with timezone support
- **bcrypt** (v5.0.1-6.0.0): Password hashing
- **chalk** (v3.0.0): Terminal string styling
- **gradient-string** (v2.0.2-3.0.0): Gradient text in terminal
- **ora** (v5.4.1-9.0.0): Terminal spinners
- **npmlog** (v1.2.0-7.0.1): Logging utility
- **node-cron** (v3.0.2-3.0.3): Task scheduling
- **totp-generator** (v2.0.0): Two-factor authentication token generation
- **pastebin-api** (v7.0.0): Pastebin integration
- **searchitunes** (v2.5.4): iTunes search API
- **bluebird** (v2.11.0): Promise library
- **lodash**: Utility functions (implied by code usage)
- **mime-db**: MIME type database (implied by code usage)

### Development & Validation
- **jsonlint-mod** (v1.7.6): JSON validation
- **graphql-query-to-json** (v2.0.1): GraphQL query parsing