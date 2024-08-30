
// const company = Convert.toCompany(json);

import type { Company } from "./types";
import { db } from "./db/db";

interface Fact {
    Year: number,
    Period: string,
    Value: string,
}


const fs = require('fs/promises');
const path = require('path');

// Directory containing JSON files
const directoryPath = path.join(__dirname, '../../node/edgar-filings/edgar');

// Function to extract entityName and cik from JSON files
const extractEntityInfo = async () => {
    try {
        // Read the directory
        const files = await fs.readdir(directoryPath);

        // Process only the top 20 files
        const topFiles = files.slice(0, 10);

        // Loop through each file in the top 20 files
        for (const file of topFiles) {
            // Check if the file is a JSON file
            if (path.extname(file) === '.json') {
                try {
                    // Read the JSON file
                    const data = await fs.readFile(path.join(directoryPath, file), 'utf8');
                    
                    // Parse the JSON data
                    const company : Company = JSON.parse(data);
                    
                    if(!company.entityName) continue;

                    console.log(`File: ${file}`);
                    console.log(`Company: ${company.entityName}`);
                    console.log(`CIK: ${company.cik}`);

                    const netIncome : Fact = {
                        Year: Object.values(company.facts["us-gaap"].NetIncomeLoss.units)[0][Object.values(company.facts["us-gaap"].NetIncomeLoss.units)[0].length - 1].fy,
                        Period: Object.values(company.facts["us-gaap"].NetIncomeLoss.units)[0][Object.values(company.facts["us-gaap"].NetIncomeLoss.units)[0].length - 1].fp,
                        Value:  currencyFormatter(Object.values(company.facts["us-gaap"].NetIncomeLoss.units)[0][Object.values(company.facts["us-gaap"].NetIncomeLoss.units)[0].length - 1].val),
                    };
                    
                    
                    // Log the formatted value
                    console.log(`Net Income: ${netIncome.Year} ${netIncome.Period} ${netIncome.Value}`);
                

                    console.log('------------------------');

                    const result = await db.select().from(movies).all();
                    console.log(result);

                    // if(cik == 2488) break;
                } catch (err) {
                    console.error(`Error reading file ${file}: ${err}`);
                }
            }
        }
    } catch (err) {
        console.error(`Unable to scan directory: ${err}`);
    }
};

// Call the function to extract entity info
extractEntityInfo();


const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};