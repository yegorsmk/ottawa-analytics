import { app } from './src/api/app.js';

const PORT = 3535;

console.log("Ottawa Budget Analytics API");
console.log("\nEndpoints:");
console.log(`- GET http://localhost:${PORT}/api/run-etl : Run the ETL pipeline`);
console.log(`- GET http://localhost:${PORT}/api/data/files : List available CSV files`);
console.log(`- GET http://localhost:${PORT}/api/data/:filename : Download a specific CSV file\n`);

app.listen(PORT, '0.0.0.0');