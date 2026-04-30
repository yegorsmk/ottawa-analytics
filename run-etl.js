import { ELTPipeline } from "./src/etl/pipeline.js";

console.log("Running ETL Pipeline");
const pipeline = new ELTPipeline();
const results = await pipeline.run();
console.log("Pipeline Results:");
console.log(JSON.stringify(results.summary, null, 2));