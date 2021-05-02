const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");

router.post("/", controller.create);
router.get("/", controller.ready);
router.get("/search/:id?/:name?", controller.search2);

module.exports = router;