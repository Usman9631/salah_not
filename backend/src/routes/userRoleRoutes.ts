// routes/userRoleRoutes.ts

import express from 'express';
import User from '../models/user';

const router = express.Router();

/**
 * Update user role (Admin use only!)
 * PUT /api/user/role
 * Body: { userId, role }
 */
router.put('/user/role', async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role) return res.status(400).json({ message: "Missing userId or role" });

  // You can add admin authentication logic here before allowing update
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
