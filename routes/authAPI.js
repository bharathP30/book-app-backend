import express from "express";
import User from "../models/user.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/SignUp", async (req, res) => {
    try {
       const { name, email, password } = req.body;

       if( !name?.trim() || !email?.trim() || !password?.trim()) return res.status(400).json({ message: "Details not provided"});

       const existingUser = await User.findOne({ email: email });

       if(existingUser){
       
        return res.status(400).json({ message: "User with this email already exists. Please Log In instead" });
       }

    const user = await User.create({
      name: name,
      email: email,
      password: password  // Will be hashed automatically!
    });

    const token = generateToken(user._id, user.email);

   res.status(201).json({
      message: 'Account created successfully!',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

    } catch (error) {
        res.status(500).json({ message: "Error signing up", error: error.message})
    }
});

router.post("/LogIn", async (req, res) => {
     try {
       const { email, password } = req.body;

       const user = await User.findOne({ email: email })
      
       if(!user){
        return res.status(401).json({
          error: 'Invalid email or password'
        });
       }

       const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {

      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

     const token = generateToken(user._id, user.email);
    
    
    res.json({
      message: 'Login successful!',
      token: token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message})
    }
});

export default router;

// DEBUGGING VERSION - routes/authAPI.js
// Replace your current authAPI.js with this temporarily to see where it fails

// import express from "express";
// import User from "../models/user.js";
// import { generateToken } from "../middleware/auth.js";

// const router = express.Router();

// router.post("/SignUp", async (req, res) => {
//     console.log("\n========================================");
//     console.log("🔵 SIGNUP REQUEST RECEIVED");
//     console.log("========================================");
    
//     try {
//         console.log("📦 Step 1: Checking request body");
//         console.log("   Body:", req.body);
        
//         const { name, email, password } = req.body;
        
//         console.log("📦 Step 2: Extracted values");
//         console.log("   Name:", name);
//         console.log("   Email:", email);
//         console.log("   Password:", password ? "***provided***" : "MISSING");
        
//         console.log("📦 Step 3: Validating fields");
//         if (!name?.trim() || !email?.trim() || !password?.trim()) {
//             console.log("❌ Validation failed - empty fields");
//             return res.status(400).json({ message: "Details not provided" });
//         }
//         console.log("✅ Validation passed");
        
//         console.log("📦 Step 4: Checking for existing user");
//         const existingUser = await User.findOne({ email: email });
//         console.log("   Existing user?", existingUser ? "YES" : "NO");
        
//         if (existingUser) {
//             console.log("❌ User already exists");
//             return res.status(400).json({ 
//                 message: "User with this email already exists. Please Log In instead" 
//             });
//         }
//         console.log("✅ Email is available");
        
//         console.log("📦 Step 5: Creating user in database");
//         console.log("   About to call User.create()...");
        
//         const user = await User.create({
//             name: name,
//             email: email,
//             password: password
//         });
        
//         console.log("✅ User created successfully!");
//         console.log("   User ID:", user._id);
//         console.log("   User name:", user.name);
//         console.log("   User email:", user.email);
//         console.log("   Password hashed?", user.password.startsWith("$2b$") ? "YES" : "NO");
        
//         console.log("📦 Step 6: Generating token");
//         const token = generateToken(user._id, user.email);
//         console.log("✅ Token generated:", token.substring(0, 20) + "...");
        
//         console.log("📦 Step 7: Sending response");
//         res.status(201).json({
//             message: 'Account created successfully!',
//             token: token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
        
//         console.log("✅✅✅ SIGNUP COMPLETED SUCCESSFULLY ✅✅✅");
//         console.log("========================================\n");
        
//     } catch (error) {
//         console.log("\n❌❌❌ ERROR IN SIGNUP ❌❌❌");
//         console.log("Error name:", error.name);
//         console.log("Error message:", error.message);
//         console.log("Full error:");
//         console.log(error);
//         console.log("Stack trace:");
//         console.log(error.stack);
//         console.log("========================================\n");
        
//         res.status(500).json({ 
//             message: "Error signing up", 
//             error: error.message 
//         });
//     }
// });

// router.post("/LogIn", async (req, res) => {
//     console.log("\n========================================");
//     console.log("🔵 LOGIN REQUEST RECEIVED");
//     console.log("========================================");
    
//     try {
//         console.log("📦 Request body:", req.body);
        
//         const { email, password } = req.body;
        
//         console.log("📦 Step 1: Finding user");
//         const user = await User.findOne({ email: email });
        
//         if (!user) {
//             console.log("❌ User not found");
//             return res.status(401).json({
//                 error: 'Invalid email or password'
//             });
//         }
//         console.log("✅ User found:", user.email);
        
//         console.log("📦 Step 2: Comparing passwords");
//         const isPasswordCorrect = await user.comparePassword(password);
//         console.log("   Password match?", isPasswordCorrect ? "YES" : "NO");
        
//         if (!isPasswordCorrect) {
//             console.log("❌ Wrong password");
//             return res.status(401).json({ 
//                 error: 'Invalid email or password' 
//             });
//         }
//         console.log("✅ Password correct");
        
//         console.log("📦 Step 3: Generating token");
//         const token = generateToken(user._id, user.email);
//         console.log("✅ Token generated");
        
//         res.json({
//             message: 'Login successful!',
//             token: token, 
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
        
//         console.log("✅✅✅ LOGIN COMPLETED SUCCESSFULLY ✅✅✅");
//         console.log("========================================\n");
        
//     } catch (error) {
//         console.log("\n❌❌❌ ERROR IN LOGIN ❌❌❌");
//         console.log("Error:", error.message);
//         console.log("Full error:", error);
//         console.log("========================================\n");
        
//         res.status(500).json({ 
//             message: "Error logging in", 
//             error: error.message 
//         });
//     }
// });

// export default router;