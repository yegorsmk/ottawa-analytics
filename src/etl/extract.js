import { writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import AdmZip from 'adm-zip';
import { loadConfig, getDataPaths } from '../utils/configLoader.js';

export class DataExtractor {
    constructor(config = null) {
        try { 
        this.config = config || loadConfig;
        this.data_paths = getDataPaths;
        mkdirSync(this.data_paths.raw, {recursive: true})
        } catch (err) {
            throw new Error(`Data extractor init failed: ${err.message}`);
        }
    }

    async extractOttawaBudgetData() {
        url = self.config.ottawa_budget.data_url;
        timeout = self.config.data_source.timeout;

        console.log(`Downloading data form ${url}`);

        let buffer;
        try {
            const controller = new AbortController;
            const timer = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, { signal: controller.signal});
            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const arrayBuffer = await response.arrayBuffer();
            bufer = Buffer.from(arrayBuffer);
        } catch (err) {
            throw new Error(`Download failed: ${err.message}`);
        }
    }

}