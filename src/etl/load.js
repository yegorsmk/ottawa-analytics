import { loadConfig, getDataPaths } from "../utils/configLoader.js";
import { join, basename } from "path";
import { parse } from "csv-parse/sync";
import { copyFileSync, mkdirSync, readFileSync } from "fs";

export class DataLoader {
    constructor(config = null) {
        this.config = config || loadConfig();
        this.dataPaths = getDataPaths();
        mkdirSync(this.dataPaths.exports, { recursive: true});
    }

    async exportFiles(processedFiles) {
        console.log("Exporting files");

        const exported = [];

        for (const srcPath of processedFiles) {
            try {
                const dstPath = join(self.dataPaths.exports, basename(srcPath));
                
            } catch (err) {

            }
        }
    }
}
