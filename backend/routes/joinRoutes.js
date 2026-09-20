const router = require("express").Router();
const Booking = require("../models/Booking");

const MAX_CAPACITY = 20;

// ========================
// CREATE BOOKING
// ========================
router.post("/", async (req,res)=>{

  const { sportId, time } = req.body;

  try{

    const count = await Booking.countDocuments({ sportId, time });

    if(count >= MAX_CAPACITY){
      return res.status(400).json({ message: "This slot is full" });
    }

    const booking = await Booking.create(req.body);
    res.json(booking);

  }catch(err){
    res.status(500).json({ message:"Server error" });
  }

});

// ========================
// GET COUNT (for slots)
// ========================
router.get("/count", async (req,res)=>{

  const { sportId, time } = req.query;

  const count = await Booking.countDocuments({ sportId, time });

  res.json({ count });
});

// ========================
// DELETE BOOKING (CANCEL)
// ========================
router.delete("/:id", async (req,res)=>{

  try{

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking cancelled" });

  }catch(err){
    res.status(500).json({ message:"Error cancelling booking" });
  }

});

module.exports = router;
