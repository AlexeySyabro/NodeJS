const fs = require("fs");
const { Transform } = require("stream");

const UseFile = "./access.log";
const ip_add = ["89.123.1.41", "34.48.240.111"];

const fileName = (ip) => `./${ip}_requests.log`;

const readStream = new fs.createReadStream(UseFile, "utf-8");

ip_add.forEach((ip) => {
    const regExp = new RegExp("^" + ip + ".*$", "gm");
    const outputFileName = fileName(ip);

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const transformedChunk = chunk
        .toString()
        .match(regExp)
        .join("\n");
    callback(null, transformedChunk);
    },
});

const writeStream = fs.createWriteStream(outputFileName, "utf-8");

readStream.pipe(transformStream).pipe(writeStream);
});

console.log("Запись завершена!");