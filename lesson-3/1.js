const fs = require("fs");
const { Transform } = require("stream");

const readStream = new fs.createReadStream("./access.log", "utf-8");
const writeStream = fs.createWriteStream("./89.123.1.41_requests.log", {
    flars: "a",
    encoding: "utf-8",
});


const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const transformedChunk = chunk
        .toString()
        .replace(new RegExp("89.123.1.41", "g"));
    callback(null, transformedChunk);
    },
});

readStream.pipe(transformStream).pipe(writeStream);

console.log("Запись завершена!");