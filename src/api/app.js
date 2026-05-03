import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { ETLPipeline } from "../etl/pipeline.js";
import express from "express";
import cors from "cors";
import { createReadStream, statSync, readdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '..', '..', 'public')));

const exportsPath = join(__dirname, '..', '..', 'data', 'exports');


// GET /api/run-etl
app.get('/api/run-etl', async (req, res) => {
    try {
        const pipeline = new ETLPipeline();
        const results = await pipeline.run();

        res.json({
            status: 'success',
            message: 'ETL pipeline completed successfully',
            timestamp: new Date().toISOString(),
            summary: results.summary,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/data/files
app.get('/api/data/files', (req, res) => {
    try {
        const allFiles = readdirSync(exportsPath);
        const csvFiles = allFiles.filter(f => f.endsWith('.csv'));

        if (csvFiles.length === 0) {
            return res.status(404).json({ error: 'No CSV files found' });
        }

        const files = csvFiles
        .map(name => {
            const filePath = join(exportsPath, name);
            const stats = statSync(filePath);
            return {
                name,
                size_kb: Math.round(stats.size / 1024 * 10),
                modified: stats.mtime.toISOString(),
                url: `/api/data/${name}`,
            };
        })
        .sort((a,b) => new Date(b.modified) - new Date(a.modified));

        res.json({ files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/data/:filename
app.get('/api/data/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = join(exportsPath, filename);

        try {
            statSync(filePath);
        } catch (err) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        createReadStream(filePath).pipe(res);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export { app };