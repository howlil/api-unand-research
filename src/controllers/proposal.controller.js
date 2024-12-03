const prisma = require('../configs/db');

async function createProposal(req, res) {
    try {
        const { judul, deskripsi } = req.body;
        const { project_id } = req.params;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Proposal file is required.', data: null });
        }

        const isCollaborator = await prisma.project_Collaborator.findFirst({
            where: {
                AND: [
                    { project_id },
                    { user_id: userId },
                ],
            },
        });

        if (!isCollaborator) {
            return res.status(403).json({ message: 'Access denied. You are not part of this project.', data: null });
        }



        const existingProposal = await prisma.proposal.findUnique({
            where: { project_id },
        });

        if (existingProposal) {
            return res.status(400).json({ message: 'Proposal already exists for this project.', data: null });
        }

        const file_url = `https://${req.get('host')}/files/${req.file.filename}`;

        const newProposal = await prisma.proposal.create({
            data: {
                judul,
                deskripsi,
                file_url,
                status: 'PENDING',
                project_id,
            },
        });

        return res.status(201).json({
            message: 'Proposal created successfully',
            data: newProposal,
        });
    } catch (error) {
        console.error('Error creating proposal:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function approveProposal(req, res) {
    try {
        const { project_id } = req.params;
        const { status } = req.body; // Either 'SELESAI' or 'DITOLAK'
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied. Only admins can approve proposals.', data: null });
        }

        // Check if the proposal exists
        const proposal = await prisma.proposal.findUnique({
            where: { project_id },
        });

        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found.', data: null });
        }

        // Update the proposal status
        const updatedProposal = await prisma.proposal.update({
            where: { project_id },
            data: { status },
        });

        return res.status(200).json({
            message: `Proposal status updated to ${status}`,
            data: updatedProposal,
        });
    } catch (error) {
        console.error('Error approving proposal:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

async function getProposalByUser(req, res) {
    try {
        const { user_id } = req.user.id;

        // Fetch all projects the user is part of
        const proposals = await prisma.proposal.findMany({
            where: {
                project: {
                    project_collaborator: {
                        some: { user_id },
                    },
                },
            },
        });

        if (proposals.length === 0) {
            return res.status(404).json({ message: 'No proposals found for the user.', data: null });
        }

        return res.status(200).json({
            message: 'Proposals fetched successfully',
            data: proposals,
        });
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}


async function getProposalCounts(req, res) {
    try {
        const { status } = req.query; // Optional filter for status
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied. Only admins can view proposals.', data: null });
        }

        // Count proposals based on the status
        const whereClause = status ? { status } : {};
        const count = await prisma.proposal.count({ where: whereClause });

        return res.status(200).json({
            message: 'Proposal count fetched successfully',
            data: { count, status: status || 'ALL' },
        });
    } catch (error) {
        console.error('Error fetching proposal counts:', error);
        return res.status(500).json({ message: 'Internal server error', data: null });
    }
}

module.exports = { createProposal, approveProposal, getProposalByUser, getProposalCounts }
