#!/bin/bash

# 🎨 Complete Gallery Validation Test
# Tests all three interactive experiences + gallery entrance

echo "🎭 SIXBYNINE GALLERY - COMPLETE VALIDATION TEST"
echo "================================================"
echo ""

# Color codes for pretty output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test function
test_file() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

test_content() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local file=$1
    local pattern=$2
    local description=$3
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

test_size() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local file=$1
    local min_size=$2
    local description=$3
    
    if [ -f "$file" ]; then
        size=$(wc -c < "$file" | tr -d ' ')
        if [ "$size" -ge "$min_size" ]; then
            echo -e "${GREEN}✓${NC} $description (${size} bytes)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${RED}✗${NC} $description (only ${size} bytes, expected >${min_size})"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        echo -e "${RED}✗${NC} $description (file not found)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "📋 Part 1: File Structure"
echo "-------------------------"
test_file "gallery.html" "Gallery entrance exists"
test_file "index.html" "Quantum Poetry HTML exists"
test_file "quantum-poetry.js" "Quantum Poetry JS exists"
test_file "dreamscape.html" "Dreamscape HTML exists"
test_file "dreamscape.js" "Dreamscape JS exists"
test_file "synesthesia.html" "Synesthesia HTML exists"
test_file "synesthesia.js" "Synesthesia JS exists"
echo ""

echo "📄 Part 2: Documentation"
echo "------------------------"
test_file "README.md" "Main README exists"
test_file "README_QUANTUM.md" "Quantum Poetry README exists"
test_file "DREAMSCAPE_README.md" "Dreamscape README exists"
test_file "SYNESTHESIA_README.md" "Synesthesia README exists"
echo ""

echo "🔍 Part 3: Gallery Navigation"
echo "-----------------------------"
test_content "gallery.html" "index.html" "Link to Quantum Poetry"
test_content "gallery.html" "dreamscape.html" "Link to Dreamscape"
test_content "gallery.html" "synesthesia.html" "Link to Synesthesia"
test_content "gallery.html" "Quantum Poetry Visualizer" "Quantum title present"
test_content "gallery.html" "Neural Dreamscape Composer" "Dreamscape title present"
test_content "gallery.html" "Synesthesia Engine" "Synesthesia title present"
echo ""

echo "🎨 Part 4: Quantum Poetry Validation"
echo "------------------------------------"
test_content "index.html" "quantum-poetry.js" "JS file linked"
test_content "quantum-poetry.js" "class QuantumField" "QuantumField class defined"
test_content "quantum-poetry.js" "createQuantumPoem" "Poetry generation present"
test_content "quantum-poetry.js" "lorenz" "Lorenz attractor present"
test_size "quantum-poetry.js" 20000 "Quantum Poetry substantial code"
echo ""

echo "🎵 Part 5: Dreamscape Validation"
echo "--------------------------------"
test_content "dreamscape.html" "dreamscape.js" "JS file linked"
test_content "dreamscape.js" "class NeuralDreamscape" "NeuralDreamscape class defined"
test_content "dreamscape.js" "spawnCreature" "Creature system present"
test_content "dreamscape.js" "reproduceCreatures" "Reproduction present"
test_content "dreamscape.js" "godMode" "God Mode present"
test_size "dreamscape.js" 25000 "Dreamscape substantial code"
echo ""

echo "⚡ Part 6: Synesthesia Validation"
echo "---------------------------------"
test_content "synesthesia.html" "synesthesia.js" "JS file linked"
test_content "synesthesia.js" "class SynesthesiaEngine" "SynesthesiaEngine class defined"
test_content "synesthesia.js" "createGravityWell" "Gravity wells present"
test_content "synesthesia.js" "createTimeDistortion" "Time distortion present"
test_content "synesthesia.js" "createFractalBranch" "Fractal recursion present"
test_content "synesthesia.js" "toggleConsciousness" "Consciousness present"
test_size "synesthesia.js" 30000 "Synesthesia substantial code"
echo ""

echo "🎛️ Part 7: Feature Coverage"
echo "---------------------------"
# Quantum Poetry features
test_content "quantum-poetry.js" "createVortex" "Vortex mode"
test_content "quantum-poetry.js" "cosmicExplosion" "Explosion mode"
test_content "quantum-poetry.js" "quantumTunnel" "Tunnel mode"

# Dreamscape features
test_content "dreamscape.js" "pentatonic" "Musical scales"
test_content "dreamscape.js" "mutation" "Genetic mutations"

# Synesthesia features
test_content "synesthesia.js" "dimensions" "Multi-dimensional"
test_content "synesthesia.js" "conscious" "Consciousness system"
test_content "synesthesia.js" "reality" "Reality integrity"
echo ""

echo "🌐 Part 8: GitHub Pages Ready"
echo "-----------------------------"
test_file "README.md" "README.md for repo landing"
test_content "README.md" "GitHub Pages" "Deployment instructions"
test_content "README.md" "gallery.html" "Gallery mentioned"
echo ""

echo "📊 Part 9: Code Quality"
echo "----------------------"
# Check for audio API usage
test_content "quantum-poetry.js" "AudioContext" "Audio in Quantum"
test_content "dreamscape.js" "AudioContext" "Audio in Dreamscape"
test_content "synesthesia.js" "AudioContext" "Audio in Synesthesia"

# Check for canvas usage
test_content "quantum-poetry.js" "canvas" "Canvas in Quantum"
test_content "dreamscape.js" "canvas" "Canvas in Dreamscape"
test_content "synesthesia.js" "canvas" "Canvas in Synesthesia"
echo ""

echo "🎯 Part 10: Control Systems"
echo "---------------------------"
test_content "index.html" "Vortex Mode" "Quantum controls labeled"
test_content "dreamscape.html" "God Mode" "Dreamscape controls labeled"
test_content "synesthesia.html" "Gravity" "Synesthesia controls labeled"
echo ""

echo "================================================"
echo ""
echo "📈 TEST RESULTS:"
echo "----------------"
echo -e "${BLUE}Total Tests:${NC}  $TOTAL_TESTS"
echo -e "${GREEN}Passed:${NC}       $PASSED_TESTS"
echo -e "${RED}Failed:${NC}       $FAILED_TESTS"
echo ""

# Calculate percentage
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENT=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${BLUE}Success Rate:${NC} ${PERCENT}%"
    echo ""
    
    if [ $PERCENT -eq 100 ]; then
        echo -e "${GREEN}🎉 PERFECT! All systems operational!${NC}"
        echo ""
        echo "✨ Your gallery is ready for deployment!"
        echo ""
        echo "Next steps:"
        echo "1. git init"
        echo "2. git add ."
        echo "3. git commit -m 'Initial commit: Interactive art gallery'"
        echo "4. git remote add origin https://github.com/username/sixbynine.git"
        echo "5. git push -u origin main"
        echo "6. Enable GitHub Pages in repo settings"
        echo ""
        echo "Then access your gallery at:"
        echo "https://username.github.io/sixbynine/gallery.html"
        exit 0
    elif [ $PERCENT -ge 90 ]; then
        echo -e "${YELLOW}⚠️  Nearly perfect! A few minor issues.${NC}"
        exit 1
    elif [ $PERCENT -ge 75 ]; then
        echo -e "${YELLOW}⚠️  Most tests passed, but some fixes needed.${NC}"
        exit 1
    else
        echo -e "${RED}❌ Multiple failures detected. Review required.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ No tests were run!${NC}"
    exit 1
fi
