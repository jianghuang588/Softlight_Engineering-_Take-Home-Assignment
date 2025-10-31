# UI State Capture Dataset

## Overview
Captured 5 different workflows in Notion, demonstrating the system's ability to navigate and capture non-URL UI states.

## Workflows Captured

### 1. Create Page in Notion
- **Task**: "How do I create a new page in Notion?"
- **States Captured**: Initial page, button click, modal/form, final state

### 2. Create Database in Notion  
- **Task**: "How do I create a database in Notion?"
- **States Captured**: Initial, button interaction, form state, completion

### 3. Create Task in Notion
- **Task**: "How do I add a new task in Notion?"
- **States Captured**: Homepage, add button, task form, success

### 4. Filter Tasks in Notion
- **Task**: "How do I filter tasks in Notion?"
- **States Captured**: List view, filter button, filter options, filtered results

### 5. Search in Notion
- **Task**: "How do I search in Notion?"
- **States Captured**: Main page, search activation, search interface, results

## Technical Approach
- Uses pattern matching to find UI elements dynamically
- Captures states based on UI changes, not URLs
- Generalizable to any web app without hardcoding
