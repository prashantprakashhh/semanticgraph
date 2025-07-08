// import { Router } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { z } from 'zod';
// import { config } from '../config';

// const router = Router();

// // In-memory user store (replace with a database in production)
// const users: any[] = [];

// const registerSchema = z.object({
//   username: z.string().min(3),
//   password: z.string().min(6),
// });

// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = registerSchema.parse(req.body);
//     if (users.find(u => u.username === username)) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = { id: users.length + 1, username, password: hashedPassword };
//     users.push(newUser);
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid data', details: error });
//   }
// });

// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = registerSchema.parse(req.body);
//     const user = users.find(u => u.username === username);
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid data', details: error });
//   }
// });

// export default router;

// backend/src/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// In-memory user store (replace with proper database)
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

const users: User[] = [];
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register endpoint
router.post('/register', async (req, res) => {
  console.log('[AUTH] Register request received:', req.body);
  
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
    
  } catch (error) {
    console.error('[AUTH] Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  console.log('[AUTH] Login request received:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth routes working!',
    timestamp: new Date().toISOString()
  });
});

export default router;