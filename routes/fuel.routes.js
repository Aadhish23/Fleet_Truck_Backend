// BACKEND/routes/fuel.routes.js
const express = require('express');
const router = express.Router();
const { addFuelLog, getFuelSummary } = require('../controllers/fuel.controller');

// POST - add a fuel log manually
router.post('/', addFuelLog);

// GET - get data for charts
router.get('/summary', getFuelSummary);

module.exports = router;
