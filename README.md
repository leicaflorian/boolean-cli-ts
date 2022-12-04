# Boolean CLI

This is a CLI for BooleanCareers Teachers and Tutors.

Its purpose is to provide useful tools to use in their daily work and simplify repetitive tasks live renaming and
uploading zoom video recordings, scaffolding new projects, create github repos and more.

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

## Modules

### Config

This module is used to configure the CLI. It allows you to set the default values for the other modules.

### Video Rename

Tool for renaming zoom video recordings based on the Boolean Careers naming convention.
It also allows you to upload the renamed videos to a Google Drive folder. For this feature you will first need to
configure the CLI with the Google Drive folder path.

#### Options

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

### Scaffold

```bash
boolean scaffold --help
```

### Repo Creator

```bash
boolean repo --help
```
