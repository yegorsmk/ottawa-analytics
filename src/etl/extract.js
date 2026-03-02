import { writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import AdmZip from 'adm-zip';
import { loadConfig, getDataPaths } from '../utils/configLoader.js';

export class DataExtractor {
    constructor(config = null) {
        this.config = config || loadConfig();
        this.data_paths = getDataPaths();
        mkdirSync(this.data_paths.raw, {recursive: true})
    }

    async extractOttawaBudgetData() {
        const url = this.config.ottawa_budget.data_url;
        const timeout = this.config.data_source.timeout;

        console.log(`Downloading data form ${url}`);

        let buffer;
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, { signal: controller.signal});
            clearTimeout(timer);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } catch (err) {
            throw new Error(`Download failed: ${err.message}`);
        }

        const extractedFiles = [];
        try {
            const zip = new AdmZip(buffer);
            const zipEntries = zip.getEntries();

            for (const entry of zipEntries) {
                if (entry.entryName.endsWith('.csv')) {

                    const fileName = basename(entry.entryName);
                    const outputPath = join(this.data_paths.raw, fileName);

                    const csvContent = entry.getData().toString('utf-8');
                    writeFileSync(outputPath, csvContent, 'utf-8');
                    extractedFiles.push(outputPath);
                }
            }
        } catch (err) {
            throw new Error(`ZIP extraction failed: ${err.message}`);
        }

        console.log(`Successfully extracted ${extractedFiles.length} files`);
        return extractedFiles;
    }

}