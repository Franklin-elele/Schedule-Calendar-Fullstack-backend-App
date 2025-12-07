const Event = require("../models/events.models");


// ---------- Schedule Event Controller ----------
exports.scheduledEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, isRecurring, recurrencePattern, assignedTo } = req.body;
    const createdBy = req.user._id;

    if (!title || !description || !startDate || !endDate || !createdBy) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (isRecurring && !recurrencePattern) {
      return res.status(400).json({ message: "Recurrence pattern required for recurring events" });
    }

    const finalAssignedTo = assignedTo && assignedTo.length > 0
      ? assignedTo
      : [createdBy];

    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      createdBy,
      assignedTo: finalAssignedTo,
      recurrencePattern,
      isRecurring,
    });

    await newEvent.save();

    res.status(200).json({
      message: "Scheduled Events Created Successfully",
      newEvent,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- Get All Events Controller ----------
exports.getAllEvents = async (req, res) => {
  try {
    let query = {};

    // If user role, filter by assignedTo
    if (req.user.role === 'user') {
      query.assignedTo = req.user._id;
    } else {
      query.$or = [
        {createdBy: req.user._id},
        {assignedTo: req.user._id} 
      ]
    }
    // Admin/staff see all (no filter)

    const events = await Event.find(query)
      .populate('createdBy', '-password')
      .sort({ startDate: 1 });  // Sort by date

    res.status(200).json({ events });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --------- Get Event by ID Controller ----------
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate('createdBy', 'name email')
      // .populate('assignedTo', 'name email');
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ----------- Update Event Controller ----------
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate('createdBy', 'name email')
      // .populate('assignedTo', 'name email');

    if (!updates) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", updates })

  } catch (err) {
    res.status(400).json({ error: err.message });
  };
}

// ---------- Delete Event Controller ----------
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role === 'user' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this event" });
    }

    await Event.findByIdAndDelete(id)

    res.status(200).json({ message: "Event deleted successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }

  // try {
  //   const { id } = req.params;
  //   const event = await Event.findByIdAndDelete(id)

  //   if (!event) {
  //     return res.status(404).json({ message: "Event not found" });
  //   }
  //   res.status(200).json({ message: "Event deleted successfully" });

  // } catch (err) {
  //   res.status(400).json({ error: err.message });
  // }

}