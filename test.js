import { DataExtractor } from "./src/etl/extract.js";
import { DataTransformer } from "./src/etl/transform.js";

console.log("Testing extraction");
const extractor = new DataExtractor();
const rawFiles = await extractor.extractOttawaBudgetData();
console.log("\neXtracted files: ");
rawFiles.forEach(f => console.log(` ${f} `));

console.log("Testing transformation");
const transformer = new DataTransformer();
const processedFiles = await transformer.transform(rawFiles);
console.log("\nProcessed Files: ");
processedFiles.forEach(f => console.log(` ${f}`));
