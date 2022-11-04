const crypto = require("crypto");

const keygen1 = crypto.randomBytes(32).toString("hex");
const keygen2 = crypto.randomBytes(32).toString("hex");

console.table({ keygen1, keygen2 });
