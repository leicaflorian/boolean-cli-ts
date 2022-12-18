# Boolean CLI

This is a CLI for BooleanCareers Teachers and Tutors.

Its purpose is to provide useful tools to use in their daily work and simplify repetitive tasks live renaming and
uploading zoom video recordings, scaffolding new projects, create github repos and more.

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands--modules)
    - [config](#config)
    - [video-rename](#video-rename)
    - [scaffold](#scaffold)
    - [repo](#repo-creator)

# Requirements

- NodeJS
- NPM
- Git
- Github CLI *(optional)*

# Installation

The CLI is available as a package on NPM.
To install it, run the following command:

```bash
npm install -g boolean-cli
```

# Usage

In a terminal, run `boolean` to see the available commands.

```bash
boolean --help
```

# Commands / Modules

## Config

This module is used to configure the CLI. It allows you to set the default values for the other modules.

### Options

- `-a | --all` - Read all existing settings
- `-r | --reset` - Reset and remove all existing settings

```shell
# Read all existing settings
boolean config -a

# Reset and remove all existing settings
boolean config -r
```

### Commands

- `video-rename [options]` - Settings for `video-rename` command
    - **Options**
        - `-s | --show-all` - Read all existing settings for this command
        - `--drive-folder [path]` - Path to the folder where the videos will be stored
        - `--multipart-files [true|false]` - If true, when renaming a video, will be prompted with the right name
          suggestion

```shell
# Read all existing settings for video-rename command
boolean config video-rename -s

# Set the drive folder path
boolean config video-rename --drive-folder /path/to/folder

# Read the configured drive folder path
boolean config video-rename --drive-folder

# Set multipart files to true
boolean config video-rename --multipart-files true|false

# Read the configured multipart files value
boolean config video-rename --multipart-files
```

## Video Rename

Tool for renaming zoom video recordings based on the Boolean Careers naming convention.
It also allows you to upload the renamed videos to a Google Drive folder. For this feature you will first need to
configure the CLI with the Google Drive folder path.

### Options

- `-u` or `--upload` - Upload the renamed videos to the configured folder
- `-d <path>` or `--dir <path>` - Path to the folder where the process will look for the videos to rename
- `-r` or `--revert` - Revert the renaming process

```bash
# Show help
boolean video-rename --help

# Start wizard for renaming all videos in the current folder
boolean video-rename [-u]

# Start wizard for renaming all videos in the specified folder
boolean video-rename -d <path> [-u]

# Revert the last renaming operation. 
# If a directory is specified, it will work in that directory.
boolean video-rename [-d <path>] -r
```

## Scaffold

Tool for scaffolding new projects. It will create the specified files inside the specified folder.

Creatable files are:

- HTML
- PHP
- CSS
- JS
- Images
- README.md

Also allow to include third party libraries (prompted when creating an HTML file), through CDN, like:

- Bootstrap
- Font Awesome
- Axios
- Vue 3

### Options

- `-a | --all` - Create basic HTML, CSS, JS and README.md files
- `-d | --dir <path>` - Path to the folder where the files will be created *(default: current folder)*
- `-h | --html [filename]` - Create basic HTML file *(default: index.html)*
- `-p | --php [filename]` - Create basic PHP file *(default: index.php)*
- `-c | --css [filename]` - Create basic CSS file *(default: css/style.css)*
- `-j | --js [filename]` - Create basic JS file *(default: js/main.js)*
- `-i | --img` - Create images folder with a logo and favicon
- `-r | --readme [filename]` - Create README.md file

```bash
# Show help
boolean scaffold --help

# Start wizard for scaffolding a new project
boolean scaffold [-d path/to/folder]

# Create basic HTML, CSS, JS and README.md files
boolean scaffold -a [-d path/to/folder]

# Create basic HTML file with the specified name or with default name
boolean scaffold -h [filename] [-d path/to/folder]

# Create basic PHP file with the specified name or with default name
boolean scaffold -p [filename] [-d path/to/folder]

# Create basic JS file with the specified name or with default name
boolean scaffold -j [filename] [-d path/to/folder]

# Create basic CSS file with the specified name or with default name
boolean scaffold -c [filename] [-d path/to/folder]

# Create images folder with a logo and favicon
boolean scaffold -i [-d path/to/folder]

# Create a .md file with the specified name or with default name
boolean scaffold -r [filename] [-d path/to/folder]
```

## Repo Creator

Tool for creating a new Github repository. It will create the repository, clone it, scaffold it and create an initial
commit.

Requires Git and the Github CLI to be installed.

### Arguments

- `repo_title` - Title of the repository *(required)*

### Options

- `-o | --org <org_name>` - Name of the organization where the repository will be created
- `-d | --delete <repo-name>` - Delete the specified repository
- `-p | --public` - Create a public repository *(default: private)*
- `-ei | --existIgnore` Ignore it the repository already exists and continue with the process

```bash
# Show help
boolean repo --help

# Start wizard for creating a new repository
boolean repo <repo_title> [-o org_name] [-p]

# Create a public repository
boolean repo <repo_title> -p

# Create a public repository in the specified organization
boolean repo <repo_title> -o <org_name> -p

# Ignore it the repository already exists and continue with the process
boolean repo <repo_title> -ei

# Delete the specified repository
boolean repo <repo_name> -d 

# Delete the specified repository in the specified organization
boolean repo <organization/repo_name> -d
boolean repo <repo_name> -d -o <org_name>
```
