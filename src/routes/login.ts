import { Router } from "express";

const router = Router();

router.get("/success", (req, res) => {
    res.send("Logged in");
});

export default router;