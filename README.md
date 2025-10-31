cat > README.md << 'EOF'
# UI State Capture System

AI agent that automatically navigates web apps and captures UI states for any given task.

## Setup
```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/softlight-ui-capture.git
cd softlight-ui-capture
npm install
npx playwright install
```

## Usage
```bash
# Single task
node agent.js "How do I create a page in Notion?"

# All tasks
node agent.js all
```

## Results Location

All screenshots saved in `/screenshots` folder:
- Each workflow gets its own folder
- Screenshots numbered by step (step-1, step-2, etc.)
- Metadata.json contains task details

## Dataset Overview

**5 Workflows Captured:**
1. Create Page in Notion
2. Create Database in Notion  
3. Create Task in Notion
4. Filter Tasks in Notion
5. Search in Notion

**Total: 20 UI states captured**

## Technical Approach

- **Natural Language Processing**: Parses questions to understand intent
- **Dynamic Element Finding**: Pattern matching, not hardcoded selectors
- **State Detection**: Identifies modals, forms, overlays
- **Generalizable**: Works on any web app without code changes

## Key Features

- No hardcoded element IDs
- Captures non-URL states (modals, forms)
- Extensible to other apps
- Organized output with metadata

## Project Structure
```
├── agent.js              # Main code
├── package.json          # Dependencies
├── README.md            # This file
└── screenshots/         # Captured UI states (5 workflows, 20 screenshots)
```

## Author

Huang Jiang
EOF# Softlight_Engineering-_Take-Home-Assignment
# Softlight_Engineering-_Take-Home-Assignment
# Softlight_Engineering-_Take-Home-Assignment
