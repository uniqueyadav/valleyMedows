const express = require("express");

const router = express.Router();

const {

    addRoom,
    getRooms,
    getSingleRoom,
    updateRoom,
    deleteRoom

} = require("../controllers/roomController");



router.post("/add", addRoom);

router.get("/", getRooms);

router.get("/:id", getSingleRoom);

router.put("/update/:id", updateRoom);

router.delete("/delete/:id", deleteRoom);



module.exports = router;