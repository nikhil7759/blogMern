import express from "express"
import {normalUser,adminUser} from "../controllers/test.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.get('/should-be-logged-in', verifyToken, normalUser)
router.get('/should-be-admin', verifyToken, adminUser)

export default router