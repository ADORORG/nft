/* 
* Copy ../lib/models to /src/models
*/

const fs = require('fs');
const path = require('path');

class FileCopier {

    static isDirectory(path) {
        return fs.lstatSync(path).isDirectory();
    }

    static copySingleFile(src, dest) {
        if (!fs.existsSync(src)) throw new Error('File does not exist');
        const content = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(path.join(dest, path.basename(src)), content, { recursive: true, encoding: 'utf8'});
    }

    static copyFolder(src, dest) {
        if (!fs.existsSync(src)) throw new Error('Folder not found');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive: true}); // create the folder
        }

        const {files, folders} = fs.readdirSync(src).reduce((prev, curr) => {
            if (FileCopier.isDirectory(path.join(src, curr))) prev.folders.push(curr);
            else prev.files.push(curr);
            return prev;
        }, {files: [], folders: []})

        // copy all the files
        files.forEach(file => FileCopier.copySingleFile(path.join(src, file), dest));
        // handle folders here
        if (folders.length) {
            folders.forEach(folder => FileCopier.copyFolder(
                path.join(src, folder), 
                path.join(dest, folder)
            ));
        }
    }

    /* 
    * @param src: Source file or folder
    * @param dest: Destination folder
    */
    static copyFile(src, dest) {
        if (FileCopier.isDirectory(src)) {
            FileCopier.copyFolder(src, dest);
        } else {
            FileCopier.copySingleFile(src, dest);
        }
    }

    static copyFiles(copies) {
        copies.forEach(([src, dest]) => {
            FileCopier.copyFile(src, dest);
        })
    }
}

const requireFolders = [
    // folders
    'models',
    'types',
]

const requireFiles = [
    // files
    'app.config.ts',
]

requireFiles.forEach(file => FileCopier.copySingleFile(
    path.join(__dirname, `../lib/${file}`),
    path.join(__dirname, `/src/lib/`)
))

requireFolders.forEach(folder => FileCopier.copyFolder(
    path.join(__dirname, `../lib/${folder}`),
    path.join(__dirname, `/src/lib/${folder}`)
))

