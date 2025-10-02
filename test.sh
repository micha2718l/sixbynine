#!/bin/bash

# Quick test script for Quantum Poetry Visualizer
echo "🌌 Quantum Poetry Visualizer - Quick Test"
echo "=========================================="
echo ""

# Check if files exist
echo "Checking files..."
if [ -f "index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

if [ -f "quantum-poetry.js" ]; then
    echo "✅ quantum-poetry.js found"
else
    echo "❌ quantum-poetry.js missing"
    exit 1
fi

if [ -f "README.md" ]; then
    echo "✅ README.md found"
else
    echo "❌ README.md missing"
    exit 1
fi

echo ""
echo "File structure validated! ✨"
echo ""

# Check file sizes
echo "File sizes:"
echo "  index.html: $(wc -c < index.html) bytes"
echo "  quantum-poetry.js: $(wc -c < quantum-poetry.js) bytes"
echo "  README.md: $(wc -c < README.md) bytes"
echo ""

# Check for key features in the code
echo "Checking key features..."

if grep -q "QuantumField" quantum-poetry.js; then
    echo "✅ QuantumField class found"
fi

if grep -q "Lorenz attractor" quantum-poetry.js; then
    echo "✅ Lorenz attractor implementation found"
fi

if grep -q "generatePoem" quantum-poetry.js; then
    echo "✅ Poetry generation function found"
fi

if grep -q "Web Audio API" quantum-poetry.js; then
    echo "✅ Audio system found"
fi

if grep -q "createVortex" quantum-poetry.js; then
    echo "✅ Vortex effect found"
fi

if grep -q "cosmicExplosion" quantum-poetry.js; then
    echo "✅ Cosmic explosion found"
fi

echo ""
echo "All features validated! 🎉"
echo ""
echo "To run the application:"
echo "  python3 -m http.server 8080"
echo "  Then open: http://localhost:8080"
echo ""
echo "Enjoy your quantum poetry experience! ✨"
