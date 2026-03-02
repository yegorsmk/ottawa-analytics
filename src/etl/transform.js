import path, { basename } from 'path';
import { parse } from 'csv-parse/sync';
import { loadConfig, getDataPaths } from '../utils/configLoader.js';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { stringify } from 'csv-stringify/sync';

export class DataTransformer {
    constructor (config = null) {
        this.config = config || loadConfig();
        this.dataPaths = getDataPaths();
        mkdirSync(this.dataPaths.processed, { recursive: true });
    }

    async transform(inputFiles) {
        const processedFiles = [];

        for (const file of inputFiles) {
            try { 
                console.log(`Processing: ${basename(file)}`);

                // Read and parse CSV into JS objects
                const rawContent = readFileSync(file, 'utf-8');
                const records = parse(rawContent, {
                    columns: true,
                    skip_empty_lines: true,
                });

                // Normalize column names (lowercase, spaces to underscores)
                const headers = Object.keys(records[0]);
                const normalizedHeaders = headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));

                const normalized = records.map(row => {
                    const newRow = {};
                    for (let i = 0; i < headers.length; i++) {
                        newRow[normalizedHeaders[i]] = row[headers[i]];
                    }
                    return newRow;
                });

                // Remove duplicates
                const initialCount = normalized.length;
                const seen = new Set();
                const deduplicated = normalized.filter(row => {
                    const serialized = JSON.stringify(row);
                    if (seen.has(serialized)) return false;
                    seen.add(serialized);
                    return true;
                });

                if (deduplicated.length < initialCount) {
                console.log(`Removed ${initialCount - deduplicated.length} duplicate items`);
                }

                // Save processed file
                const outputPath = path.join(this.dataPaths.processed, basename(file));
                writeFileSync(outputPath, stringify(deduplicated, { header: true }), 'utf-8');

                processedFiles.push(outputPath);
        } catch (err) {
            throw new Error(`Failed to transform ${basename(file)}: ${err.message}`);
        }
    }

    return processedFiles;
    }

}