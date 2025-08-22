# Installation Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Access to a MediaWiki installation
- MediaWiki user account with appropriate permissions

## Installation Methods

### Method 1: Global Installation (Recommended)

```bash
# Install globally via npm
npm install -g @open-e/mediawiki-mcp-server-auth

# Verify installation
mediawiki-mcp-server-auth --version
```

### Method 2: Local Installation

```bash
# Install in your project
npm install @open-e/mediawiki-mcp-server-auth

# Run locally
npx mediawiki-mcp-server-auth
```

### Method 3: From Source

```bash
# Clone repository
git clone https://github.com/Open-E/MediaWiki-MCP-Server-Auth.git
cd MediaWiki-MCP-Server-Auth

# Install dependencies
npm install

# Run directly
npm start
```

## Configuration Setup

### Step 1: MediaWiki User Setup

1. **Create Bot User in MediaWiki**:
   - Log into your MediaWiki as admin
   - Go to Special:CreateAccount
   - Create user (e.g., "WikiBot")
   - Assign to appropriate groups

2. **Set User Permissions**:
   ```php
   # In LocalSettings.php, ensure bot users have required rights
   $wgGroupPermissions['bot']['edit'] = true;
   $wgGroupPermissions['bot']['createpage'] = true;
   $wgGroupPermissions['bot']['upload'] = true;
   $wgGroupPermissions['bot']['apihighlimits'] = true;
   ```

### Step 2: Environment Configuration

#### Option A: Environment Variables

```bash
# Create .env file or export variables
export MEDIAWIKI_API_URL="http://your-wiki.example.com/api.php"
export MEDIAWIKI_USERNAME="WikiBot"
export MEDIAWIKI_PASSWORD="SecurePassword123"

# For custom script path (if different from /w)
export MEDIAWIKI_SCRIPT_PATH=""
```

#### Option B: Configuration File

```bash
# Copy example configuration
cp config.example.json config.json

# Edit the configuration
nano config.json
```

**config.json example**:
```json
{
  "defaultWiki": "192.168.212.10:8082",
  "wikis": {
    "192.168.212.10:8082": {
      "sitename": "Test Wiki",
      "server": "http://192.168.212.10:8082",
      "articlepath": "/index.php",
      "scriptpath": "",
      "username": "WikiBot",
      "password": "YourSecurePassword"
    },
    "wiki.example.com": {
      "sitename": "Production Wiki",
      "server": "https://wiki.example.com",
      "articlepath": "/wiki",
      "scriptpath": "/w",
      "username": "APIBot",
      "password": "AnotherSecurePassword"
    }
  }
}
```

### Step 3: Claude Code Integration

1. **Add to Claude Code MCP Configuration**:
   
   Edit your Claude Code MCP configuration file:
   ```json
   {
     "mcpServers": {
       "mediawiki-auth": {
         "command": "mediawiki-mcp-server-auth",
         "args": [],
         "env": {
           "MEDIAWIKI_API_URL": "http://your-wiki.com/api.php",
           "MEDIAWIKI_USERNAME": "WikiBot", 
           "MEDIAWIKI_PASSWORD": "SecurePassword123"
         }
       }
     }
   }
   ```

2. **Or use config file approach**:
   ```json
   {
     "mcpServers": {
       "mediawiki-auth": {
         "command": "mediawiki-mcp-server-auth",
         "args": [],
         "env": {
           "CONFIG": "/path/to/your/config.json"
         }
       }
     }
   }
   ```

## Testing Installation

### Step 1: Basic Connection Test

```bash
# Run authentication test
npm test

# Or manually test
node test/test-auth.js
```

### Step 2: Claude Code Test

1. Start Claude Code with the new MCP server
2. Test basic operations:
   ```
   Can you search for pages on the wiki?
   Can you get the content of the main page?
   Can you update a test page?
   ```

## Troubleshooting Installation

### Common Issues

**1. Command Not Found**
```bash
# If global install fails, check npm global path
npm config get prefix

# Add to PATH if needed
export PATH=$PATH:$(npm config get prefix)/bin
```

**2. Permission Errors**
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use npx instead
npx @open-e/mediawiki-mcp-server-auth
```

**3. Node Version Issues**
```bash
# Check Node.js version
node --version

# Install Node 18+ if needed
# Using nvm:
nvm install 18
nvm use 18
```

**4. MediaWiki Connection Issues**
```bash
# Test MediaWiki API directly
curl -X POST "http://your-wiki.com/api.php" \
  -d "action=query&meta=siteinfo&format=json"

# Check if API is enabled in MediaWiki
# Ensure $wgEnableAPI = true; in LocalSettings.php
```

### Verification Steps

1. **Check Installation**:
   ```bash
   which mediawiki-mcp-server-auth
   mediawiki-mcp-server-auth --help
   ```

2. **Test Configuration**:
   ```bash
   # Start server with debug output
   DEBUG=* mediawiki-mcp-server-auth
   ```

3. **Verify Permissions**:
   ```bash
   # Test authentication
   curl -X POST "http://your-wiki.com/api.php" \
     -d "action=query&meta=userinfo&format=json" \
     -u "username:password"
   ```

## Security Considerations

### Production Deployment

1. **Secure Credentials**:
   - Use environment variables, not config files in production
   - Rotate passwords regularly
   - Use dedicated bot accounts

2. **Network Security**:
   - Use HTTPS for MediaWiki in production
   - Restrict API access by IP if possible
   - Monitor API usage logs

3. **Permission Principle**:
   - Grant minimum required permissions
   - Regular audit of bot permissions
   - Log all bot activities

### Configuration Security

```bash
# Secure config file permissions
chmod 600 config.json

# Don't commit credentials to git
echo "config.json" >> .gitignore
echo ".env" >> .gitignore
```

## Next Steps

After successful installation:

1. **Test basic operations** with Claude Code
2. **Configure additional wikis** if needed
3. **Set up monitoring** for bot activities
4. **Review MediaWiki logs** for any issues
5. **Plan backup strategies** for configuration

For more advanced configuration and usage, see the main [README.md](README.md).