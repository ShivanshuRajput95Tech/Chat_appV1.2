// routes/uploadRoutes.js
const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")

router.post("/image", upload.single("file"), (req, res) => {

    res.json({
        imageUrl: `/uploads/${req.file.filename}`
    })

})

module.exports = router