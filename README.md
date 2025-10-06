# Loggo

Visualise important information for activity, planning and more

Loggo is a Windows desktop application for tracking activities, managing reminders, and visualizing data. Perfect for stock traders, project managers, or anyone who needs to log wins/losses and track their performance over time.

## Features

- 📝 **Create and Load Logs**: Create new log files or load existing ones to continue tracking
- 📌 **Notes & Reminders**: Left panel with bullet-point notes for quick reminders
- 📊 **Data Visualization**: Real-time charts and graphs showing your activity data
- 💾 **Persistent Storage**: Save your logs to JSON files for easy backup and sharing
- 📈 **Statistics Dashboard**: Track wins, losses, win rate, and cumulative profit/loss
- 🎯 **Activity Logging**: Log wins and losses with amounts and descriptions

## Screenshots

The application features a clean, modern interface with:
- Top toolbar for creating, loading, and saving logs
- Left sidebar for notes and reminders
- Right panel for activity logging and data visualization

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Loffee5422/loggo.git
cd loggo
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the application:
```bash
npm start
```

## Building for Windows

To create a Windows installer:

```bash
npm run package
```

This will create a Windows installer in the `build` directory.

## Usage

### Creating a New Log

1. Click the "New Log" button in the top toolbar
2. Enter a name for your log
3. Click "Create"

### Adding Notes

1. In the left sidebar, type your note in the input field
2. Click "Add" or press Enter
3. Notes appear as bullet points below
4. Click "Delete" next to any note to remove it

### Logging Activities

1. In the right panel, use the "Log New Activity" form
2. Select the type (Win or Loss)
3. Enter the amount
4. Optionally add a description
5. Click "Log Activity"

### Viewing Visualizations

The right panel automatically displays:
- Summary statistics (total activities, wins, losses, net profit/loss, win rate)
- Cumulative profit/loss line chart
- Win/Loss count bar chart
- Win/Loss distribution pie chart

### Saving Your Log

1. Click "Save Log" in the top toolbar
2. Choose a location and filename
3. Your log is saved as a JSON file

### Loading an Existing Log

1. Click "Load Log" in the top toolbar
2. Select a previously saved log file
3. Your notes and activities are restored

## Development

### Running in Development Mode

To run the application with hot-reload for the renderer process:

```bash
# Terminal 1: Watch and rebuild on changes
npm run dev

# Terminal 2: Start Electron
npm start
```

### Project Structure

```
loggo/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.js        # Main application logic
│   │   └── preload.js     # Preload script for IPC
│   └── renderer/          # React application
│       ├── components/    # React components
│       │   ├── NotesPanel.tsx
│       │   └── VisualizationPanel.tsx
│       ├── App.tsx        # Main app component
│       ├── index.tsx      # React entry point
│       ├── index.html     # HTML template
│       └── styles.css     # Application styles
├── dist/                  # Build output
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Technologies Used

- **Electron**: Desktop application framework
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Chart.js**: Data visualization library
- **Webpack**: Module bundler

## License

MIT License - see LICENSE file for details
