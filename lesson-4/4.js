const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const inquirer = require("inquirer");
const { Transform } = require("stream");

const isFile = (fileName) => fs.lstatSync(fileName).isFile();

const fileManager = async (directory) => {
const firstAnswer = await inquirer.prompt([
    {
        name: "fileName",
        type: "list",
        message: "Вы находитесь в директории " + directory + ". Выберите файл:",
        choices: fs.readdirSync(directory),
    },
]);

const newFilePath = path.join(directory, firstAnswer.fileName);

if (!isFile(newFilePath)) return fileManager(newFilePath);

const secondAnswer = await inquirer.prompt([
    {
        name: "search",
        type: "input",
        message: "Введите строку для поиска (опционально):",
    },
]);

const regExp = new RegExp("^.*" + secondAnswer.search + ".*$", "gm");
const readStream = fs.createReadStream(newFilePath, "utf-8");

const transformStream = new Transform({
    transform(chunk, _encoding, callback) {
        const searchArray = chunk.toString().match(regExp);
        if (searchArray) {
        const transformedChunk = searchArray.join("\n");
        callback(null, transformedChunk);
        }
    },
});

if (secondAnswer.search) {
    readStream.pipe(transformStream).pipe(process.stdout);
} else {
    readStream.pipe(process.stdout);
}
};

const options = yargs.option("d", {
    alias: "directory",
    describe: "Путь до папки",
    type: "string",
    default: process.cwd(),
}).argv;

fileManager(options.directory);