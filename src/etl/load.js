import { loadConfig, getDataPaths } from "../utils/configLoader.js";
import { join, basename } from "path";
import { parse } from "csv-parse/sync";
import { copyFileSync, mkdirSync, readFileSync } from "fs";

export class DataLoader {
    constructor(config = null) {
        this.config = config || loadConfig();
        this.dataPaths = getDataPaths();
        mkdirSync(this.dataPaths.exports, { recursive: true });
    }

    exportFiles(processedFiles) {
        console.log("Exporting files");

        const exported = [];

        for (const srcPath of processedFiles) {
            try {
                const dstPath = join(self.dataPaths.exports, basename(srcPath));
                copyFileSync(srcPath, dstPath);
                console.log(`Exported: ${basename(srcPath)}`);
                exported.push(dstPath);
            } catch (err) {
                throw new Error(`Failed to export ${basename(srcPath)}: ${err.message}`);
            }
        }
        return exported;
    }

    createSummary(processedFiles) {
        const summary = {files: [],
            total_records: 0,
            total_files: 0,
        };

        for (const file of processed_files) {
            try {
                const content = readFileSync(file, 'utf-8');
                const records = parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                });

                summary.files.push({
                    name: basename(file),
                    records: records.length,
                    columns: Object.keys(records[0] || {}),
                });

                summary.total_records += records.length;
            } catch (err) {
                throw new Error(`Failed to create summary for ${basename(file)}: ${err.message}`);
            }
        }

        summary.total_files = processedFiles.length;
        return summary;
    }

    
}
