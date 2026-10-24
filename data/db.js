import fs from "fs/promises";
import path from "path";


const datafilePath = path.resolve("data/students.json");

async function find () { 
    const data = await fs.readFile(datafilePath, "utf8");
    return JSON.parse(data);
}


export default {
find,
}





