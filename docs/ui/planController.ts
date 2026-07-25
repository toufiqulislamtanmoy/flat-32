import { Request, Response } from "express";
import { createPlan, getAllPlans, getPlanByUserId, getSinglePlanById } from "../models/plan.js";
import { formatResponse } from "../utils/response_structure.js";

export const planList = async (req: Request, res: Response) => {
  try {
    const plans = await getAllPlans();
    res.status(200).json(formatResponse("success", `${plans.length} plans found`, plans));
  } catch (err: any) {
    res.status(500).json(formatResponse("failed", "Failed to fetch plans", err));
  }
};

export const planById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json(formatResponse("failed", "Invalid id", null));
    const plan = await getSinglePlanById(id);
    const result = plan.find((p) => p.id === id);
    if (!result) return res.status(404).json(formatResponse("failed", "Plan not found", null));
    res.status(200).json(formatResponse("success", "Plan found", result));
  } catch (err: any) {
    res.status(500).json(formatResponse("failed", "Failed to fetch plan", err));
  }
};

export const planByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json(formatResponse("failed", "Invalid id", null));
    const plan = await getPlanByUserId(user_id);
    if (!plan) return res.status(404).json(formatResponse("failed", "Plan not found", null));
    res.status(200).json(formatResponse("success", "Plan found", plan));
  } catch (err: any) {
    res.status(500).json(formatResponse("failed", "Failed to fetch plan", err));
  }
};

export const addPlan = async (req: Request, res: Response) => {
  try {
    const { title, date, user_id, amount, balance, expanse } = req.body;
    if (!title) return res.status(400).json(formatResponse("failed", "Title is required", null));
    if (!date) return res.status(400).json(formatResponse("failed", "Date is required", null));
    if (!user_id) return res.status(400).json(formatResponse("failed", "User ID is required", null));

    const planId = await createPlan({ title, date, user_id, amount, balance, expanse });
    res.status(201).json(formatResponse("success", "Plan created successfully", { id: planId }));
  } catch (err: any) {
    res.status(500).json(formatResponse("failed", "Failed to create plan", err));
  }
};

