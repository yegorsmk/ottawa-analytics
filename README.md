# Ottawa Budget Analytics

ETL pipeline with REST API for analyzing City of Ottawa budget data. Downloads, processes, and serves budget data for Power BI and other analytics tools.

## Data Source

- **Source:** Ottawa Open Data Portal
- **Dataset:** 2026 Draft Budget Explorer
- **License:** Open Government License - City of Ottawa

### How the Data URL Was Found

1. Go to [Ottawa Open Data Portal](https://open.ottawa.ca)
2. Search for "budget" in the search box
3. Click on "2026 Budget Explorer" from search results
4. On the Budget Explorer page, click "Get this data from the City of Ottawa's Open Data catalogue"
5. This opens the dataset page: `https://open.ottawa.ca/datasets/e88c52d7727e4a9dba6d427c9bd6445c/about`
6. Click the Download button → Copy Link Address reveals:
   `https://www.arcgis.com/sharing/rest/content/items/e88c52d7727e4a9dba6d427c9bd6445c/data`

## Overview

```
Ottawa Open Data → ETL Pipeline → CSV Files → REST API → Power BI / Browser Charts
```

### Data Flow

```
data/raw/           ← Original CSVs extracted from ZIP
       ↓
data/processed/     ← Normalized (lowercase columns, duplicates removed)
       ↓
data/exports/       ← Final files served by the API
```

## Features

- ✅ Downloads ZIP from Ottawa Open Data Portal
- ✅ Extracts 9 CSV files
- ✅ Normalizes column names (lowercase, underscores)
- ✅ Removes duplicate records
- ✅ REST API for data access
- ✅ Interactive browser charts (no dependencies)
- ✅ Power BI ready

## Requirements

- **Node.js** >= 22
- **npm** >= 9

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run ETL pipeline
node run-etl.js

# 3. Start API server
node run-api.js

# 4. Open charts in browser
# http://localhost:5551/charts.html
```

## Project Structure

```
ottawa_analytics/
├── config/
│   └── config.json              # Data source configuration
├── data/                        # (gitignored)
│   ├── raw/                     # Downloaded CSV files
│   ├── processed/               # Cleaned data
│   └── exports/                 # Final exports served by API
├── public/
│   └── charts.html              # Interactive browser charts
├── src/
│   ├── api/
│   │   └── app.js              # Express REST API
│   ├── etl/
│   │   ├── extract.js          # Download and unzip from Ottawa
│   │   ├── transform.js        # Clean and normalize CSVs
│   │   ├── load.js             # Copy to exports, generate summary
│   │   └── pipeline.js         # ETL orchestrator
│   └── utils/
│       └── configLoader.js     # Config and path utilities
├── run-etl.js                   # CLI entry point for ETL
├── run-api.js                   # CLI entry point for API server
├── test.js                      # Quick test script
└── package.json
```

## Data Files

The ETL pipeline downloads and processes these budget files:

| File | Records | Description |
|------|---------|-------------|
| 1_Operating_overview_expenditure.csv | 72 | Spending by committee |
| 1_Operating_overview_revenue.csv | 41 | Revenue sources |
| 2_Capital_program_by_committee.csv | 55 | Capital projects by committee |
| 2_Capital_program_by_funding_src.csv | 20 | Capital by funding source |
| 2_Capital_program_by_service_category.csv | 15 | Capital by service category |
| 3_Reserve_fund_Discretionaryreserves.csv | 130 | Reserve funds |
| 4_Rates_fees_and_charges.csv | 1,347 | City fees and charges |
| 5_Exp_brkd_by_cttee_OP_CA.csv | 453 | Detailed expense breakdown |
| 6_How_city_compares.csv | 55 | Comparison with other cities |

## REST API

Start the server:

```bash
node run-api.js
```

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/run-etl` | Run ETL pipeline |
| `GET /api/data/files` | List available CSV files |
| `GET /api/data/<filename>` | Download specific file |

### Example Usage

```bash
# Run ETL
curl http://localhost:5551/api/run-etl

# List files
curl http://localhost:5551/api/data/files

# Download a file
curl http://localhost:5551/api/data/1_Operating_overview_expenditure.csv -o expenditure.csv
```

## Charts

Make sure the API server is running and ETL has been run at least once, then open:

```
http://localhost:5551/charts.html
```

Charts included:
- **Expenditure by Committee** — 2026 spending by committee (horizontal bar)
- **Budget Comparison** — 2025 vs 2026 side by side (grouped bar)
- **Capital by Service Category** — 2026 capital program breakdown (pie)
- **Capital by Funding Source** — 2026 capital by funding source (horizontal bar)
- **City Tax Rate Comparison** — Ottawa vs other cities, Ottawa highlighted in red (horizontal bar)

## Power BI Integration

1. Start API server: `node run-api.js`
2. List available files: `http://localhost:5551/api/data/files`
3. In Power BI: **Get Data → Web**
4. URL: `http://localhost:5551/api/data/<filename>`

With ngrok (remote access):

```bash
ngrok http 5551
```

Then use:
```
https://<your-ngrok-url>/api/data/files
https://<your-ngrok-url>/api/data/<filename>
```

## Configuration

Edit `config/config.json`:

```json
{
  "ottawa_budget": {
    "data_url": "https://www.arcgis.com/sharing/rest/content/items/e88c52d7727e4a9dba6d427c9bd6445c/data",
    "dataset_name": "2026 Draft Budget Explorer",
    "description": "City of Ottawa Draft Budget Data"
  },
  "data_source": {
    "timeout": 60000
  }
}
```

## Dependencies

```json
{
  "adm-zip": "^0.5.10",
  "cors": "^2.8.5",
  "csv-parse": "^5.5.6",
  "csv-stringify": "^6.4.6",
  "express": "^4.19.0"
}
```

No native dependencies — installs cleanly on any platform without system libraries.
