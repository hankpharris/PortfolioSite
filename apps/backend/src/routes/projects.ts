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

export default router;
