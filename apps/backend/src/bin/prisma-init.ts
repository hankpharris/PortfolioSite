import { PrismaClient } from "database";

const client = new PrismaClient();

async function main() {
    const project = await client.project.createMany({
        data: [
            {
                name: "Portfolio",
                status: "InProgress",
                description: "Project 1 description",
                overviewLink: "N/a",
                link: "N/A",
                gitHubLink: "N/a",
            },
        ],
    });

    console.log("Created project:", project);
}

main()
    .catch(e => {
        console.error("Error:", e.message);
    })
    .finally(async () => {
        await client.$disconnect();
    });
