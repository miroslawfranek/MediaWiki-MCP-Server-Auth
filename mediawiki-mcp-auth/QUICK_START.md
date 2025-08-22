# Quick Start Guide

## Installation

### Method 1: Install from Package File

```bash
# Download and install the package
npm install -g ./open-e-mediawiki-mcp-server-auth-1.0.0.tgz

# Or install locally
npm install ./open-e-mediawiki-mcp-server-auth-1.0.0.tgz
```

### Method 2: Install from Source

```bash
# Run the install script
./install.sh

# Or manually
npm install
npm link  # for global installation
```

## Configuration

### Quick Setup

```bash
# Interactive configuration setup
npm run setup-config

# Or manually create config.json
cp config.example.json config.json
# Edit config.json with your settings
```

### Environment Variables

```bash
export MEDIAWIKI_API_URL="http://your-wiki.com/api.php"
export MEDIAWIKI_USERNAME="WikiBot"
export MEDIAWIKI_PASSWORD="your-password"
```

## Testing

```bash
# Test authentication
npm test

# Or manually
node test/test-auth.js
```

## Usage with Claude Code

Add to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "mediawiki-auth": {
      "command": "mediawiki-mcp-server-auth",
      "args": [],
      "env": {
        "CONFIG": "/path/to/config.json"
      }
    }
  }
}
```

## Example Commands

```bash
# Start server
mediawiki-mcp-server-auth

# With custom config
CONFIG=./my-config.json mediawiki-mcp-server-auth

# Debug mode
DEBUG=* mediawiki-mcp-server-auth
```

That's it! Your MediaWiki MCP Server with authentication is ready to use.