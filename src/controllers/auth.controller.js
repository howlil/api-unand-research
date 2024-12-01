const prisma = require('../configs/db');
const validate = require('../middlewares/validate.middleware');
const validation = require('../validations/auth.validation');
const { generateToken } = require('../utils/jwt.js');
const { checkPassword, encryptPassword } = require('../utils/bcrypt.js');

async function register_user(req, res) {
    try {
        console.log('Validating register user input...');
        const validatedData = validate(validation.register_user, req.body);

        console.log('Checking if email exists...');
        const userExists = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (userExists) {
            return res.status(400).json({ message: 'Email already exists', data: null });
        }

        console.log('Encrypting password...');
        const hashedPassword = await encryptPassword(validatedData.password);

        console.log('Creating new user...');
        const newUser = await prisma.user.create({
            data: {
                email: validatedData.email,
                nama: validatedData.nama,
                password: hashedPassword,
            },
        });

        console.log('User registered successfully');
        return res.status(201).json({
            message: 'User registered successfully',
            data: { id: newUser.id, email: newUser.email, nama: newUser.nama },
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function login_user(req, res) {
    try {
        console.log('Validating login user input...');
        const validatedData = validate(validation.login_user, req.body);

        console.log('Fetching user by email...');
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password', data: null });
        }

        console.log('Validating password...');
        const isPasswordValid = await checkPassword(validatedData.password, user.password);

        if (!isPasswordValid) {
            return res.status(404).json({ message: 'Invalid email or password', data: null });
        }

        console.log('Generating JWT token...');
        const token = generateToken(user.id);

        console.log('User logged in successfully');
        return res.status(200).json({
            message: 'User logged in successfully',
            data: { token, user: { id: user.id, email: user.email, nama: user.nama } },
        });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

module.exports = { register_user, login_user };
