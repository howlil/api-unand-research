const { v4: uuidv4 } = require('uuid'); // To generate unique invite codes
const prisma = require('../configs/db');
const Joi = require('joi');

const createProjectSchema = Joi.object({
    nama_project: Joi.string().required().min(3),
    deskripsi: Joi.string().required().min(10),
    object: Joi.string().required(),
    collaborators: Joi.array().items(Joi.string().email()).optional(),
});

const updateProjectSchema = Joi.object({
    nama_project: Joi.string().min(3).optional(),
    deskripsi: Joi.string().min(10).optional(),
    object: Joi.string().optional(),
    is_finish : Joi.boolean().optional(),
    
}).min(1);


const addCollaboratorsSchema = Joi.object({
    project_id: Joi.string().required(),
    collaborators: Joi.array().items(Joi.string().email()).min(1).required(), // At least one valid email
});


async function addCollaborators(req, res) {
    try {
        const validatedData = await addCollaboratorsSchema.validateAsync(req.body);
        const userId = req.user.id; 
        const { project_id, collaborators } = validatedData;

        const isOwner = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { project_id },
                    { is_owner: true },
                ],
            },
        });

        if (!isOwner) {
            return res.status(403).json({
                message: 'Access denied. Only the owner can add collaborators.',
                data: null,
            });
        }

        const failedEmails = [];
        for (const email of collaborators) {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (user) {
                // Check if the user is already a collaborator
                const existingCollaborator = await prisma.project_Collaborator.findFirst({
                    where: {
                        AND: [
                            { user_id: user.id },
                            { project_id },
                        ],
                    },
                });

                if (!existingCollaborator) {
                    // Add the user as a collaborator
                    await prisma.project_Collaborator.create({
                        data: {
                            user_id: user.id,
                            project_id,
                            is_owner: false,
                            status: 'SELESAI', // Invitation status
                        },
                    });
                } else {
                    console.warn(`User with email ${email} is already a collaborator.`);
                }
            } else {
                console.warn(`User with email ${email} does not exist.`);
                failedEmails.push(email);
            }
        }

        const message = failedEmails.length
            ? `Collaborators added successfully, but the following emails could not be added: ${failedEmails.join(', ')}`
            : 'Collaborators added successfully.';

        return res.status(200).json({
            message,
            data: null,
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        console.error('Error adding collaborators:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}





async function createProject(req, res) {
    try {
        const validatedData = await createProjectSchema.validateAsync(req.body);
        const userId = req.user.id;

        console.log(`Creating project for user ID: ${userId}`);

        const inviteCode = uuidv4();

        const newProject = await prisma.project.create({
            data: {
                nama_project: validatedData.nama_project,
                deskripsi: validatedData.deskripsi,
                object: validatedData.object,
                is_finish: false,
                invite_code: inviteCode,
                project_collaborator: {
                    create: {
                        user_id: userId,
                        is_owner: true,
                        status: 'SELESAI',
                    },
                },
            },
        });

        // If collaborators are provided, add them
        if (validatedData.collaborators && validatedData.collaborators.length > 0) {
            for (const email of validatedData.collaborators) {
                const user = await prisma.user.findUnique({ where: { email } });

                if (user) {
                    await prisma.project_Collaborator.create({
                        data: {
                            user_id: user.id,
                            project_id: newProject.id,
                            is_owner: false,
                            status: 'PENDING', // Collaborators must accept the invitation
                        },
                    });

                } else {
                    console.log(`User with email ${email} does not exist.`);
                }
            }
        }

        return res.status(201).json({
            message: 'Project created successfully',
            data: { project: newProject },
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function joinProject(req, res) {
    try {
        const { invite_code } = req.body;
        const userId = req.user.id;

        const project = await prisma.project.findUnique({
            where: { invite_code },
        });

        if (!project) {
            return res.status(404).json({ message: 'Invalid invite code', data: null });
        }

        // Check if the user is already a collaborator
        const existingCollaborator = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { project_id: project.id },
                ],
            },
        });


        if (existingCollaborator) {
            return res.status(400).json({ message: 'You are already a collaborator', data: null });
        }

        // Add the user as a collaborator
        await prisma.project_Collaborator.create({
            data: {
                user_id: userId,
                project_id: project.id,
                is_owner: false,
                status: 'PENDING',
            },
        });

        return res.status(200).json({
            message: 'Successfully joined the project',
            data: { project },
        });
    } catch (error) {
        console.error('Error joining project:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function getProjects(req, res) {
    try {
        const userId = req.user.id;

        const projects = await prisma.project.findMany({
            where: {
                project_collaborator: {
                    some: { user_id: userId },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return res.status(200).json({
            message: 'Projects fetched successfully',
            data: projects,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function deleteProject(req, res) {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;

        const ownership = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { project_id: projectId },
                    { is_owner: true },
                ],
            },
        });

        if (!ownership) {
            return res.status(403).json({ message: 'Access denied. Only the owner can delete the project.', data: null });
        }
        await prisma.project_Collaborator.deleteMany({
            where: { project_id: projectId },
        });
        
        await prisma.project.delete({
            where: { id: projectId },
        });

        return res.status(200).json({ message: 'Project deleted successfully', data: null });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


async function getProjectDetails(req, res) {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;

        const isCollaborator = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { project_id: projectId },
                ],
            },
        });

        if (!isCollaborator) {
            return res.status(403).json({
                message: 'Access denied. You are not a collaborator on this project.',
                data: null,
            });
        }

        // Fetch project details
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                project_collaborator: {
                    include: {
                        User: {
                            select: { id: true, email: true, nama: true },
                        },
                    },
                },
                task: true, // Include related tasks
                proposal: true, // Include related proposal
            },
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found', data: null });
        }

        return res.status(200).json({
            message: 'Project details fetched successfully',
            data: project,
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


async function updateProject(req, res) {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;

        const validatedData = await updateProjectSchema.validateAsync(req.body);

        const ownership = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { project_id: projectId },
                    { is_owner: true },
                ],
            },
        });

        if (!ownership) {
            return res.status(403).json({ message: 'Access denied. Only the owner can update the project.', data: null });
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: validatedData,
        });

        return res.status(200).json({
            message: 'Project updated successfully',
            data: updatedProject,
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


module.exports = { createProject, joinProject,addCollaborators, getProjects, deleteProject, updateProject,getProjectDetails };
