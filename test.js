import { DataExtractor } from "./src/etl/extract.js";
import { DataTransformer } from "./src/etl/transform.js";
import { DataLoader } from "./src/etl/load.js";

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

console.log("Testing loading");
const loader = new DataLoader();
const exportedFiles = loader.exportFiles(processedFiles);
console.log("\nExported Files: ");
exportedFiles.forEach(f => console.log(` ${f}`));
const summary = loader.createSummary(processedFiles);
console.log("\nSummary:");
console.log(JSON.stringify(summary, null, 2));
