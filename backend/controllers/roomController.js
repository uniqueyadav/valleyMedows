const Room = require("../models/Room");



// ADD ROOM

exports.addRoom = async(req, res) => {

    try {

        const room = await Room.create(req.body);

        res.status(201).json({

            success: true,
            message: "Room Added Successfully",
            room

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};




// GET ALL ROOMS

exports.getRooms = async(req, res) => {

    try {

        const rooms = await Room.find();

        res.status(200).json({

            success: true,
            rooms

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};




// GET SINGLE ROOM


exports.getSingleRoom = async(req, res) => {

    try {

        const room = await Room.findById(req.params.id);

        if (!room) {

            return res.status(404).json({

                message: "Room Not Found"

            });

        }


        res.status(200).json({

            success: true,
            room

        });


    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};




// UPDATE ROOM


exports.updateRoom = async(req, res) => {

    try {

        const room = await Room.findByIdAndUpdate(

            req.params.id,
            req.body, {
                new: true
            }

        );


        res.status(200).json({

            success: true,
            message: "Room Updated Successfully",
            room

        });


    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};




// DELETE ROOM


exports.deleteRoom = async(req, res) => {

    try {

        await Room.findByIdAndDelete(req.params.id);


        res.status(200).json({

            success: true,
            message: "Room Deleted Successfully"

        });


    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};