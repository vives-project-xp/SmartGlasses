# Getting Started

This guide will walk you through setting up the SmartGlasses development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Git**: Version control system ([Download](https://git-scm.com/downloads))
- **Visual Studio Code**: Code editor ([Download](https://code.visualstudio.com/))
- **Docker Desktop**: Container platform ([Download](https://www.docker.com/products/docker-desktop/))
- **VS Code Dev Containers Extension**: For development container support ([View on Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers))

### Installing VS Code Extensions

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for and install: [**Dev Containers** by Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Step 1: Clone the Repository

Clone the SmartGlasses repository to your local machine:

```bash
git clone https://github.com/vives-project-xp/SmartGlasses.git
cd SmartGlasses
```

## Step 2: Open the Workspace

The project uses a VS Code workspace file to organize the multi-folder structure:

1. Open Visual Studio Code
2. Use one of these methods:
   - **File** > **Open Workspace from File** > Select `SmartGlasses.code-workspace`
   - Or from command line: `code SmartGlasses.code-workspace`
   - Or in file explorer, right-click `SmartGlasses.code-workspace` and choose "Open with Code"

The workspace includes three main folders:

- **Root**: Main project folder with documentation and configuration
- **Server**: FastAPI backend service
- **Client**: Expo React Native mobile application

## Step 3: Start the Development Container

The project uses Docker dev containers for a consistent development environment:

**Automatic Setup**:

1. When you open the workspace, VS Code should automatically detect the `.devcontainer` configuration and prompt you to "Reopen in Container"

**Manual Setup**:

1. If not prompted automatically:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Dev Containers: Rebuild and Reopen in Container"
   - Select this option

!!! note
    The initial container build may take 5-10 minutes as it:

    - Downloads the Python 3.12 base image
    - Installs development tools (Node.js, Android SDK, FFmpeg, Docker CLI)
    - Configures VS Code extensions
    - Sets up the development environment

## Step 4: Verify Installation

Once the container is running, verify everything is set up correctly:

### Check Python Environment

```bash
python3 --version
pip3 --version
```

### Check Node.js Environment

```bash
node --version
npm --version
```

### Check Docker Access

```bash
docker --version
```

## Step 5: Install Project Dependencies

### Server Dependencies (FastAPI)

```bash
cd server
pip3 install -r requirements.txt
```

### Client Dependencies (React Native/Expo)

```bash
cd client
npm install
```

### Notebook Dependencies (Optional - for AI/ML development)

```bash
cd notebooks
pip3 install -r requirements.txt
```

## Step 6: Start Development Services

### Start the FastAPI Server

```bash
cd server
python3 src/main.py
```

The server will be available at `http://localhost:8000`

### Start the Expo Development Server

In a new terminal:

```bash
cd client
npm start
```

This will start the Expo development server and provide options to run on:

- Web browser
- Android emulator
- iOS simulator (Mac only)
- Physical device via Expo Go app

### Start Documentation Server (Optional)

To view the project documentation locally:

```bash
docker-compose up docs
```

Documentation will be available at `http://localhost:8085`

## Development Environment Features

The dev container includes pre-installed tools and extensions:

### VS Code Extensions

- **Python**: Language support, debugging, linting
- **Jupyter**: Notebook support for AI/ML experiments
- **Postman**: API testing and development
- **Git Graph**: Visual git history
- **Markdown**: Documentation editing support
- **Prettier**: Code formatting

### Command Line Tools

- **Git**: Version control
- **Docker CLI**: Container management
- **Android SDK**: Mobile development tools
- **FFmpeg**: Media processing (for camera/video features)

## Troubleshooting

### Container Build Issues

- Ensure Docker Desktop is running
- Try rebuilding: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"
- Check Docker Desktop settings for sufficient memory allocation

### Port Conflicts

- Server (8000): Change port in `server/src/main.py`
- Docs (8085): Modify `docker-compose.yaml`
- Expo Metro (8081): Expo will automatically find available ports

### Permission Issues

The container runs as root user. If you encounter permission issues with files:

```bash
sudo chown -R $USER:$USER .
```

### Android Development

For Android development, ensure:

1. Android Studio is installed on host machine
2. USB debugging enabled on device
3. Device connected via USB or Android emulator running

## Next Steps

After successful installation:

1. **Explore the codebase**: Check out the main components in `server/` and `client/`
2. **Read the documentation**: Browse `docs/` for architecture and setup guides
3. **Run the notebooks**: Experiment with AI models in `notebooks/`
4. **Check the roadmap**: See planned features and contribute to development

For additional help, consult the project documentation or create an issue on GitHub.
