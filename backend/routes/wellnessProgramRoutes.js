const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {

getPrograms,
addProgram,
updateProgram,
deleteProgram

} = require("../controllers/wellnessProgramController");


router.get("/",getPrograms);

router.post("/",upload.single("image"),addProgram);

router.put("/:id",upload.single("image"),updateProgram);

router.delete("/:id",deleteProgram);

module.exports = router;