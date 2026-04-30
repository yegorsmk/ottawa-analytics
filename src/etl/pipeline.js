import { DataLoader } from "./load";
import { DataTransformer } from "./transform";
import { DataExtractor } from "./extract";
import { loadConfig } from "../utils/configLoader";

export class ELTPipeline {
    constructor(config = null) {
        this.config = config || loadConfig();
        this.extractor = new DataExtractor(this.config);
        this.transformer = new DataExtractor(this.config);
        this.loader = new DataLoader(this.config);
    }

    async run() {
        console.log("STARING ETL PIPELINE FOR OTTAWA BUDGET ANALYTICS");
        // store results in a json?
        // extract, transform, load, summarize
        const results = {}

        try {
            console.log("EXTRACTING DATA");
            const rawFiles = await this.extractor.extractOttawaBudgetData();
            results.rawFiles = rawFiles;

            console.log("TRANSFORMING DATA");
            const processedFiles = await this.transformer.transform(rawFiles);
            results.processedFiles = processedFiles;

            console.log("LOADING DATA");
            const exportedFiles = this.loader.exportFiles(processedFiles);
            results.exportedFiles = exportedFiles;

            console.log("CREATING SUMMARY");
            const summary = this.loader.createSummary(processedFiles);
            results.summary = summary;

            console.log("ETL PIPELINE COMPLETED SUCCESSFULLY");
        } catch (err) {
            console.error(`ETL PIPELINE FAILED: ${err.message}`);
        }

        return results;
    }

}

