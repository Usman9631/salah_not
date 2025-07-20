import express from 'express';
import User from '../models/user'; // apne model ka import
import bcrypt from "bcryptjs";
const router = express.Router();
router.put('/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Update Profile Route
router.put('/auth/profile', async (req, res) => {
  try {
    const { userId, name, email, phone, address } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
