const prisma = require("../src/configs/db")
const { encryptPassword } = require('../src/utils/bcrypt'); // Ensure you have a bcrypt utility for password encryption


async function seedAdminUser() {
    try {
        console.log("Seeding admin user...");

        const adminEmail = "admin@example.com";
        const adminPassword = "@Test123"; 
        const hashedPassword = await encryptPassword(adminPassword);

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (existingAdmin) {
            console.log("Admin user already exists.");
        } else {
            const adminUser = await prisma.user.create({
                data: {
                    email: adminEmail,
                    nama: "Admin User",
                    passwrod: hashedPassword,
                    role: "ADMIN", 
                },
            });

            console.log("Admin user created successfully:");
            console.log(`Email: ${adminUser.email}`);
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdminUser();
