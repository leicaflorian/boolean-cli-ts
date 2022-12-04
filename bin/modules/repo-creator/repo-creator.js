"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoCreator = void 0;
const path = require("path");
const inquirer = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const logs_1 = require("../../utilities/logs");
const ModuleWithSettings_1 = require("../../classes/ModuleWithSettings");
const lodash_1 = require("lodash");
const scaffold_command_1 = require("../scaffold/scaffold.command");
class RepoCreator extends ModuleWithSettings_1.ModuleWithSettings {
    formatVisibility(isPublic, ucFirst = false) {
        let visibility = isPublic ? 'public' : 'private';
        const color = isPublic ? 'green' : 'cyan';
        if (ucFirst) {
            visibility = (0, lodash_1.upperFirst)(visibility);
        }
        return chalk[color].bold(visibility);
    }
    checkGHCLI() {
        logs_1.default.info('Checking github-cli installation...');
        if (!shell.which('gh')) {
            logs_1.default.error(`Sorry, this script requires ${chalk.red.bold('\'github-cli\'')}.
          Before proceeding please download it at https://cli.github.com/.
          After downloading it, please login with ${chalk.yellow.bold('\'gh auth login\'')}`);
            shell.exit(1);
        }
        if (shell.exec('gh auth status', { silent: true }).code === 1) {
            logs_1.default.error(`Sorry, you're not logged in to github-cli.
  Please login with ${chalk.yellow.bold('\'gh auth login\'')}.
  For more info, visit https://cli.github.com/manual/gh_auth_login`);
        }
    }
    checkGITCLI() {
        logs_1.default.info('Checking git-cli installation...');
        if (!shell.which('git')) {
            logs_1.default.error(`Sorry, this script requires ${chalk.red.bold('\'git-cli\'')}.
  Before proceeding plead download it at https://git-scm.com/downloads`);
            shell.exit(1);
        }
    }
    createRepo(name, organization, isPublic, existIgnore) {
        let repoName = name;
        if (organization) {
            repoName = `${organization}/${name}`;
        }
        logs_1.default.info(`Creating ${this.formatVisibility(isPublic)} repo ${chalk.yellow.bold(repoName)}...`);
        const res = shell.exec(`gh repo create ${repoName} --${isPublic ? 'public' : 'private'}`, { silent: true });
        if (res.code === 0 || existIgnore) {
            if (res.code !== 0) {
                logs_1.default.warn(`Error while creating repo ${chalk.yellow.bold(repoName)}.
            ${res.stderr}`);
                logs_1.default.info(`Trying to continue anyway...`);
            }
            else {
                logs_1.default.info(`${this.formatVisibility(isPublic, true)} repo ${chalk.yellow.bold(repoName)} created at ${chalk.yellow.bold(res.stdout)}`);
            }
            return {
                folderName: name,
                repoName
            };
        }
        else {
            logs_1.default.error(`Error while creating repo ${chalk.yellow.bold(repoName)}.
            ${res.stderr}`);
            shell.exit(1);
        }
    }
    cloneRepo(projName, repoName) {
        logs_1.default.info(`Cloning repo to ${chalk.yellow.bold(projName)}...`);
        const res = shell.exec(`gh repo clone ${repoName} && cd ${projName}`, { silent: true });
        const repoPath = path.resolve(projName);
        if (res.code === 0) {
            logs_1.default.info(`Repo cloned at ${chalk.green.bold(repoPath)}`);
        }
        else {
            logs_1.default.error(`Error while cloning repo ${chalk.yellow.bold(repoName)}.
            ${res.stderr}`);
            shell.exit(1);
        }
    }
    createScaffolding(projName) {
        inquirer
            .prompt([
            {
                name: 'create_scaffolding',
                message: `Vuoi creare lo scaffolding iniziale per questo progetto?`,
                type: 'confirm',
                default: true
            }
        ])
            .then((answers) => {
            if (answers.create_scaffolding) {
                const scaffold = new scaffold_command_1.ScaffoldCommand();
                scaffold.action(projName, { dir: projName });
            }
        })
            .catch((error) => {
            console.log(error);
            if (error.isTtyError) {
            }
            else {
            }
        });
    }
    deleteRepo(name, organization) {
        let repoName = name;
        if (organization) {
            repoName = `${organization}/${name}`;
        }
        else if (!name.includes('/')) {
            const data = shell.exec('gh repo list --json name,nameWithOwner', { silent: true });
            const repoList = JSON.parse(data.stdout);
            const foundedRepo = repoList.find((repo) => repo.name === repoName);
            if (!foundedRepo) {
                logs_1.default.error(`Repo ${chalk.yellow.bold(repoName)} not found.`);
                shell.exit(1);
            }
            repoName = foundedRepo.nameWithOwner;
        }
        inquirer.prompt([
            {
                name: 'delete_repo',
                message: `Sei sicuro di voler eliminare definitivamente la repo ${chalk.yellow.bold(repoName)}?`,
                type: 'confirm',
                default: false
            }
        ]).then((answers) => {
            if (answers.delete_repo) {
                const deleteRes = shell.exec(`gh repo delete ${repoName} --confirm`);
                if (deleteRes.code === 0) {
                    logs_1.default.info(`Repo ${chalk.yellow.bold(repoName)} deleted`);
                }
            }
        });
    }
    changeActiveDirectory(dir) {
        shell.cd(dir);
    }
}
exports.RepoCreator = RepoCreator;
