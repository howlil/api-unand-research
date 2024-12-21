const prisma = require('../configs/db');
const { generateToken } = require('../utils/jwt.js');
const { checkPassword, encryptPassword } = require('../utils/bcrypt.js');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    nama: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const editUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    nama: Joi.string().min(3).optional(),
    password: Joi.string().min(6).optional(),
    photo_url: Joi.string().uri().optional(),
}).min(1);

async function register_user(req, res) {
    try {
        const validatedData = await registerSchema.validateAsync(req.body);

        const userExists = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (userExists) {
            return res.status(400).json({ message: 'Email already exists', data: null });
        }

        const hashedPassword = await encryptPassword(validatedData.password);

        const newUser = await prisma.user.create({
            data: {
                email: validatedData.email,
                nama: validatedData.nama,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: 'User registered successfully',
            data: { id: newUser.id, email: newUser.email, nama: newUser.nama },
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function login_user(req, res) {


    try {
        const validatedData = await loginSchema.validateAsync(req.body);
        console.log('Validated Data:', validatedData);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        console.log('Fetched User:', user);

        console.log(validatedData.password, user.password)
        if (!user || !(await checkPassword(validatedData.password, user.password))) {
            return res.status(404).json({ message: 'Invalid email or password', data: null });
        }

        const token = generateToken(user.id);
        console.log('Generated Token:', token);

        await prisma.token.create({
            data:{
                token,
                user_id: user.id
            }
        })


        return res.status(200).json({
            message: 'User logged in successfully',
            data: { token, user: { id: user.id, email: user.email, nama: user.nama } },
        });
    } catch (error) {
        console.error('Error during login:', error);

        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        if (error.message.includes("SECRET_KEY")) {
            return res.status(500).json({ message: "Internal server error: Missing SECRET_KEY", data: null });
        }
        return res.status(500).json({ message: error.message, data: null });
    }
}

async function get_users(req, res) {
    try {
        const user_id = req.user.id
        const users = await prisma.user.findUnique({
            where: {
                id: user_id
            },
            select: {
                id: true,
                email: true,
                nama: true,
                photo_url: true,
                created_at: true,
            },
        });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found', data: null });
        }

        return res.status(200).json({
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function edit_user(req, res) {
    try {
        if (req.file) {
            const img_url = `https://${req.get('host')}/images/${req.file.filename}`;
            req.body.photo_url = img_url;
        }

        const validatedData = await editUserSchema.validateAsync(req.body);

        const userId = req.user.id; // Ensure `req.user` is populated by middleware
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found', data: null });
        }

        if (validatedData.password) {
            validatedData.password = await encryptPassword(validatedData.password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: validatedData,
        });

        return res.status(200).json({
            message: 'User updated successfully',
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                nama: updatedUser.nama,
                photo_url: updatedUser.photo_url,
            },
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

module.exports = { register_user, login_user, get_users, edit_user };
