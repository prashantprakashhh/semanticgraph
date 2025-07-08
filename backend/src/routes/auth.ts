import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config';

const router = Router();

// In-memory user store (replace with a database in production)
const users: any[] = [];

// Schema for validating registration and login requests
const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = authSchema.parse(req.body);

    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };
    users.push(newUser);

    console.log('[AUTH] User registered:', newUser.username);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = authSchema.parse(req.body);
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1d' } // Token expires in 1 day
    );
    
    console.log('[AUTH] User logged in:', user.username);
    res.json({ token });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;