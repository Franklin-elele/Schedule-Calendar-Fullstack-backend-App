import { findById } from '../models/staff.models';

// ---------- Check if Staff is Active Controller ----------

export async function staffIsActive(req, res) {
    try {
        const { id } = req.params;
        const staff = await findById(id)
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' })
        }
        staff.isActive = !staff.isActive;
        await staff.save();
        res.status(200).json({ isActive: staff.isActive });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}