#!/bin/bash

# Setup script for Modular Monolith

set -e

echo "🚀 Setting up Modular Monolith..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created. Please update it with your database credentials."
else
    echo ""
    echo "✓ .env file already exists."
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo ""
    read -p "🐳 Do you want to start PostgreSQL with Docker? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting PostgreSQL with Docker Compose..."
        docker-compose up -d
        echo "✓ PostgreSQL is running on port 5432"
        echo "✓ pgAdmin is running on port 5050 (http://localhost:5050)"
        echo ""
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 5
    fi
fi

# Check database connection
echo ""
echo "🗄️  Checking database connection..."

# Run migrations
echo ""
read -p "Do you want to run migrations? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    npm run migration:run
    echo "✓ Migrations completed"
fi

# Seed database
echo ""
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    npm run seed:run
    echo "✓ Database seeded"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run start:dev"
echo ""
echo "API will be available at:"
echo "  http://localhost:3000/api/v1"
echo ""
echo "API Documentation:"
echo "  http://localhost:3000/api/docs"
echo ""
echo "Happy coding! 🎉"
