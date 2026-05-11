import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

async function migration() {
    if (!process.env.Database_URL) {
        throw new Error("Database_URL is not defined");
    }

    const client = new Client({
        connectionString: process.env.Database_URL,
    });

    console.log("......Migrations Started......");
    await client.connect();

    try {
        const db = drizzle(client);
        await migrate(db, { migrationsFolder: __dirname + "/migrations" });
        console.log("......Migrations Completed......");
        process.exit(0); // 0 means success
    } finally {
        await client.end();
    }
}

migration().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1); // 1 means an error occurred
});
