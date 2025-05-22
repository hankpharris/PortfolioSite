import express, { Router, Request, Response } from "express";
import prisma from "../bin/prisma-client";

const router: Router = express.Router();

// Get all projects
router.get("/", async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// Get a single project by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Failed to fetch project" });
    }
});

export default router;
