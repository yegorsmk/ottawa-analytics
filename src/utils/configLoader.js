//Loads config from json file and helper fxn to get directory paths for data storage

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Load config from JSON file

export function loadConfig(configPath=null) {
    try {
        if (configPath === null) {
            // root directory (src/utils -> src -> root)
            const projectRoot = path.join(__dirname, '..', '..');
            configPath = path.join(projectRoot, 'config', 'config.yaml');
        }

        const fileContents = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(fileContents);

        return config;

    } catch (err) {
        console.error('Error loading config:', err.message);
        throw err;
        }
}

//Get data directory paths

export function getDataPaths() {
    const projectRoot = path.join(__dirname, '..', '..');

    const paths = {
        rawData: path.join(projectRoot, 'data', 'raw'),
        processedData: path.join(projectRoot, 'data', 'processed'),
        exports: path.join(projectRoot, 'data', 'exports'),
    };

    return paths
}


