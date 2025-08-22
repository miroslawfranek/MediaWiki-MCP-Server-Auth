# MediaWiki MCP Server with Authentication

A modified version of the Professional Wiki MediaWiki MCP Server that supports **username/password authentication** instead of OAuth. This server enables Claude Code to interact with MediaWiki installations using session-based authentication.

## Features

- ✅ **Username/Password Authentication** - No OAuth setup required
- ✅ **Session Management** - Proper cookie handling and session persistence
- ✅ **Modern API Support** - Uses MediaWiki's `clientlogin` API
- ✅ **Full MCP Compatibility** - Works with all Claude Code MCP tools
- ✅ **Easy Configuration** - Simple environment variable setup
- ✅ **Production Ready** - Robust error handling and logging

## Quick Start

### Installation

```bash
# Install globally
npm install -g @open-e/mediawiki-mcp-server-auth

# Or install locally
npm install @open-e/mediawiki-mcp-server-auth
```

### Configuration

1. **Set Environment Variables**:
```bash
export MEDIAWIKI_API_URL="http://your-wiki.com/api.php"
export MEDIAWIKI_USERNAME="your-username"
export MEDIAWIKI_PASSWORD="your-password"
```

2. **Or Create Config File**:
```bash
# Copy example config
cp config.example.json config.json

# Edit config.json with your settings
```

### Usage

```bash
# Start the server
mediawiki-mcp-server-auth

# Or with custom config
CONFIG=./my-config.json mediawiki-mcp-server-auth
```

## Configuration Options

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MEDIAWIKI_API_URL` | MediaWiki API endpoint | `http://wiki.example.com/api.php` |
| `MEDIAWIKI_USERNAME` | Username for authentication | `WikiBot` |
| `MEDIAWIKI_PASSWORD` | Password for authentication | `SecurePassword123` |
| `CONFIG` | Path to config file | `./config.json` |

### Config File Format

```json
{
  "defaultWiki": "my-wiki.com",
  "wikis": {
    "my-wiki.com": {
      "sitename": "My Wiki",
      "server": "http://my-wiki.com",
      "articlepath": "/wiki",
      "scriptpath": "/w",
      "username": "WikiBot",
      "password": "SecurePassword123"
    }
  }
}
```

## Available Tools

- `set-wiki` - Set the target wiki for operations
- `get-page` - Retrieve page content and metadata
- `search-page` - Search for pages by title or content
- `update-page` - Edit existing wiki pages
- `create-page` - Create new wiki pages
- `get-page-history` - View page revision history
- `get-file` - Access file information

## Authentication Requirements

### MediaWiki User Setup

1. **Create a Bot User**:
   - Create a dedicated user account for API access
   - Assign appropriate permissions (typically `bot`, `edit` groups)
   - Use a strong, unique password

2. **Required Permissions**:
   - `edit` - Edit pages
   - `createpage` - Create new pages
   - `upload` - Upload files (if needed)
   - `bot` - Bot flag for high-volume operations

### Security Best Practices

- Use dedicated bot accounts, not personal accounts
- Set strong passwords and rotate them regularly
- Limit bot user permissions to minimum required
- Monitor bot activity through MediaWiki logs
- Consider using bot passwords instead of main account passwords

## Troubleshooting

### Common Issues

**Authentication Fails**:
```bash
# Check credentials
curl -X POST "http://your-wiki.com/api.php" \
  -d "action=query&meta=userinfo&format=json"

# Test login
node test/test-auth.js
```

**Connection Errors**:
- Verify MediaWiki URL is accessible
- Check firewall and network settings
- Ensure MediaWiki API is enabled

**Permission Denied**:
- Verify user has required permissions
- Check MediaWiki user rights configuration
- Review MediaWiki $wgGroupPermissions settings

### Debug Mode

```bash
# Enable verbose logging
DEBUG=mediawiki-mcp-server mediawiki-mcp-server-auth
```

## Development

### Building from Source

```bash
git clone https://github.com/Open-E/MediaWiki-MCP-Server-Auth.git
cd MediaWiki-MCP-Server-Auth
npm install
npm run build
```

### Testing

```bash
# Run authentication tests
npm test

# Manual testing
node test/test-auth.js
```

## Migration from OAuth Version

If migrating from the OAuth-based MCP server:

1. **Remove OAuth Configuration**:
```bash
unset MEDIAWIKI_OAUTH_CONSUMER_KEY
unset MEDIAWIKI_OAUTH_CONSUMER_SECRET
```

2. **Set Username/Password**:
```bash
export MEDIAWIKI_USERNAME="your-bot-user"
export MEDIAWIKI_PASSWORD="your-bot-password"
```

3. **Update Claude Code Configuration**:
   - Replace MCP server command in Claude Code settings
   - Update server name in MCP configuration

## License

GPL-2.0-or-later - Same as the original MediaWiki MCP Server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Open-E/MediaWiki-MCP-Server-Auth/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Open-E/MediaWiki-MCP-Server-Auth/discussions)
- **Documentation**: [Wiki Pages](https://github.com/Open-E/MediaWiki-MCP-Server-Auth/wiki)

## Acknowledgments

Based on the [Professional Wiki MediaWiki MCP Server](https://github.com/ProfessionalWiki/MediaWiki-MCP-Server) with modifications for username/password authentication.