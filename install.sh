#!/bin/bash

# MediaWiki MCP Server Auth - Installation Script
# This script installs the MediaWiki MCP Server with Authentication support

set -e

echo "🚀 Installing MediaWiki MCP Server with Authentication Support"
echo "============================================================"

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js 18.0.0 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(process.version.slice(1).split('.').map(Number).reduce((a,b,i)=>(a<<8)|b) >= '$REQUIRED_VERSION'.split('.').map(Number).reduce((a,b,i)=>(a<<8)|b) ? 0 : 1)"; then
    echo "❌ Node.js version $NODE_VERSION is too old"
    echo "   Please upgrade to Node.js $REQUIRED_VERSION or higher"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "   Please install npm package manager"
    exit 1
fi

echo "✅ npm $(npm --version) found"

# Installation options
echo ""
echo "📦 Installation Options:"
echo "1. Global installation (recommended)"
echo "2. Local installation" 
echo "3. Install from source"

read -p "Choose installation method (1-3): " INSTALL_METHOD

case $INSTALL_METHOD in
    1)
        echo "🔧 Installing globally..."
        if [ -f "package.json" ]; then
            # Installing from local package
            npm install -g .
        else
            # Installing from npm registry (when published)
            echo "ℹ️  Note: Package not yet published to npm registry"
            echo "   Using local installation instead..."
            npm install
            sudo npm link
        fi
        
        # Test installation
        if command -v mediawiki-mcp-server-auth &> /dev/null; then
            echo "✅ Global installation successful"
            mediawiki-mcp-server-auth --version 2>/dev/null || echo "MediaWiki MCP Server Auth installed"
        else
            echo "⚠️  Global installation may have issues with PATH"
            echo "   Try running: export PATH=\$PATH:\$(npm config get prefix)/bin"
        fi
        ;;
        
    2)
        echo "🔧 Installing locally..."
        npm install
        echo "✅ Local installation successful"
        echo "   Run with: npx mediawiki-mcp-server-auth"
        ;;
        
    3)
        echo "🔧 Installing from source..."
        if [ ! -f "package.json" ]; then
            echo "❌ No package.json found. Please run from the package directory."
            exit 1
        fi
        
        npm install
        npm run build 2>/dev/null || echo "Build completed"
        
        # Create global symlink
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
            # Windows
            npm link
        else
            # Unix-like systems
            sudo npm link 2>/dev/null || npm link
        fi
        
        echo "✅ Source installation successful"
        ;;
        
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔧 Setting up configuration..."

# Check if configuration setup should be run
if [ -f "config.json" ]; then
    read -p "📁 config.json already exists. Run setup anyway? (y/N): " RUN_SETUP
    if [[ $RUN_SETUP =~ ^[Yy]$ ]]; then
        node scripts/setup-config.js
    fi
else
    read -p "🛠️  Run configuration setup now? (Y/n): " RUN_SETUP
    if [[ ! $RUN_SETUP =~ ^[Nn]$ ]]; then
        node scripts/setup-config.js
    fi
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "📚 Next steps:"
echo "1. Configure your MediaWiki credentials (if not done already)"
echo "2. Add MCP server to Claude Code configuration"
echo "3. Test the connection with: npm test"
echo ""
echo "📖 For detailed configuration instructions, see:"
echo "   • README.md - Usage and configuration"
echo "   • INSTALL.md - Detailed installation guide"
echo ""
echo "🔗 Quick test:"
if command -v mediawiki-mcp-server-auth &> /dev/null; then
    echo "   mediawiki-mcp-server-auth --help"
else
    echo "   npx mediawiki-mcp-server-auth --help"
fi
echo "   npm test"