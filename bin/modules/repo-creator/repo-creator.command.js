"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoCreatorCommand = void 0;
const BasicCommand_1 = require("../../classes/BasicCommand");
const repo_creator_1 = require("./repo-creator");
class RepoCreatorCommand extends BasicCommand_1.default {
    constructor() {
        super();
        this.module = new repo_creator_1.RepoCreator();
    }
    register(program) {
        this.command = program.command('repo')
            .description('Create a remote repo, clones it and eventually scaffolds its files.')
            .usage('repo_title [organization] [option]')
            .argument('<repo_title>', 'Title of the repo will be created')
            .option('-o, --org <org>', 'organization where to create the repo')
            .option('-p, --public', 'create a public repo')
            .option('-d, --delete', 'delete a repo irreversibly')
            .option('-ei, --existIgnore', 'Ignore if the repo already exists and continue cloning it')
            .showHelpAfterError()
            .action((...args) => this.action(args[0], args[1]));
    }
    action(repoTitle, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let organization = options.org ? options.org.replace(/^=/, '') : null;
            if (options.delete) {
                this.module.deleteRepo(repoTitle, organization);
                return;
            }
            this.module.checkGITCLI();
            this.module.checkGHCLI();
            const newRepo = this.module.createRepo(repoTitle, organization, options.public, options.existIgnore);
            // clone repo
            this.module.cloneRepo(newRepo.folderName, newRepo.repoName);
            // scaffold files
            this.module.createScaffolding(newRepo.folderName);
            // change active directory
            // this.module.changeActiveDirectory(newRepo.folderName)
        });
    }
}
exports.RepoCreatorCommand = RepoCreatorCommand;
//# sourceMappingURL=repo-creator.command.js.map