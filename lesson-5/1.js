const http = require("http");
const path = require("path");
const fs = require("fs");

const HTML = fs.readFileSync("./index.html", "utf-8");

const promisifyFs = 
    (method, error, callback = (data) => data) =>
    (path) =>
    new Promise((resolve, reject) => {
        fs[method](path, (err, data) => {
        if (err) {
            return reject(error);
        }
        resolve(callback(data));
        });
    });

const readFile = promisifyFs("readFile", "Error when read file");
const readdir = promisifyFs("readdir", "Error when read dir");
const isFile = promisifyFs("lstat", "Error when read dir or file", (stats) =>
    stats.isFile()
);

const generateHTMLContent = async (dir, path) => {
    dirName = dir === "/" ? "" : dir + "/";
const dirContent = await readdir(path);
const listContent = 
    `<ol>
        ${dirContent
        .map((item) => `<li><a href="${dirName + item}">${item}</a></li>`)
        .join("\n")}
    </ol>`;

return HTML.replace("{{content}}", listContent);
};

const server = http.createServer(async (req, res) => {
    try {
        if (req.method === "GET") {
            if (req.url === "/") {
                const htmlContent = await generateHTMLContent("", __dirname);
            return res.end(htmlContent);
            }

    const itemPath = path.join(__dirname, req.url);
    const itemIsFile = await isFile(itemPath);

    if (itemIsFile) {
        const data = await readFile(itemPath);
        return res.end(data);
    }

    const htmlContent = await generateHTMLContent(req.url, itemPath);
    return res.end(htmlContent);
    }
    res.writeHead(405, "Method not Allowed");
    res.end();
    } catch (e) {
        res.writeHead(400, e);
        res.end();
}
});

server.listen(8085);