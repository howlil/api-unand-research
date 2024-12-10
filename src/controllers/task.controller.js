const Joi = require('joi');
const prisma = require('../configs/db');

const createTaskSchema = Joi.object({
    deskripsi: Joi.string().min(10).required(),
    deadline: Joi.string().required(),
    penanggung_jawab: Joi.string().required(), 
    project_id: Joi.string().required(),
});

const updateTaskSchema = Joi.object({
    deskripsi: Joi.string().min(10).optional(),
    deadline: Joi.string().optional(),
    is_finish: Joi.boolean().optional(),
    penanggung_jawab: Joi.string().optional(),
}).min(1); 

async function createTask(req, res) {
    try {
        const validatedData = await createTaskSchema.validateAsync(req.body);
        const userId = req.user.id;

        // Check if the user is part of the project
        const isAuthorized = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { project_id: validatedData.project_id },
                    { user_id: userId },
                ],
            },
        });

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied. You are not part of this project.', data: null });
        }

        const newTask = await prisma.task.create({
            data: {
                ...validatedData,
                is_finish:false
            },
        });

        return res.status(201).json({
            message: 'Task created successfully',
            data: newTask,
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function updateTask(req, res) {
    try {
        const validatedData = await updateTaskSchema.validateAsync(req.body);
        const userId = req.user.id;
        const taskId = req.params.id;

        // Check if the user is part of the project
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { Project: { include: { project_collaborator: true } } },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found', data: null });
        }

        const isAuthorized = task.Project.project_collaborator.some(
            (collaborator) => collaborator.user_id === userId
        );

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied. You are not part of this project.', data: null });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: validatedData,
        });

        return res.status(200).json({
            message: 'Task updated successfully',
            data: updatedTask,
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message, data: null });
        }
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


async function deleteTask(req, res) {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        // Check if the user is part of the project
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { Project: { include: { project_collaborator: true } } },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found', data: null });
        }

        const isAuthorized = task.Project.project_collaborator.some(
            (collaborator) => collaborator.user_id === userId
        );

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied. You are not part of this project.', data: null });
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return res.status(200).json({ message: 'Task deleted successfully', data: null });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


async function getAllTasks(req, res) {
    try {
        const userId = req.user.id;
        const projectId = req.params.project_id;

        // Check if the user is part of the project
        const isAuthorized = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { project_id: projectId },
                    { user_id: userId },
                ],
            },
        });

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied. You are not part of this project.', data: null });
        }

        const tasks = await prisma.task.findMany({
            where: { project_id: projectId },
        });

        return res.status(200).json({
            message: 'Tasks fetched successfully',
            data: tasks,
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function getTaskDetails(req, res) {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { Project: { include: { project_collaborator: true } } },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found', data: null });
        }

 
        const isAuthorized = task.Project.project_collaborator.filter(
            (collaborator) => collaborator.user_id === userId
        );

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied. You are not part of this project.', data: null });
        }

        return res.status(200).json({
            message: 'Task details fetched successfully',
            data: task,
        });
    } catch (error) {
        console.error('Error fetching task details:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


module.exports = {createTask,updateTask,deleteTask,getAllTasks,getTaskDetails}