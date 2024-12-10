const express = require('express')
const api = express.Router()
const {uploadImage} = require('../middlewares/upload_image.middleware.js')
const {uploadPDF} = require('../middlewares/upload_file.middleware.js')
const {authenticate} = require("../middlewares/auth.middleware.js")
const auth_controller = require("../controllers/auth.controller.js")
const project_controller = require("../controllers/project.controller.js")
const task_controller = require("../controllers/task.controller.js")
const proposal_controller = require("../controllers/proposal.controller.js")

api.use(authenticate)

// auth
api.get("/api/me",auth_controller.get_users)
api.patch("/api/me",uploadImage, auth_controller.edit_user)

// project
api.post("/api/projects",project_controller.createProject)
api.post("/api/project/join",project_controller.joinProject)
api.get("/api/projects",project_controller.getProjects)
api.get("/api/projects/:id",project_controller.getProjectDetails)
api.delete("/api/project/:id",project_controller.deleteProject)
api.patch("/api/project/:id",project_controller.updateProject)
api.post("/api/project/collaborators",project_controller.addCollaborators)

// task
api.post("/api/task",task_controller.createTask)
api.patch("/api/task/:id",task_controller.updateTask)
api.delete("/api/task/:id", task_controller.deleteTask)
api.get("/api/tasks/:project_id", task_controller.getAllTasks)
api.get("/api/tasks/:id", task_controller.getTaskDetails)

// proposal
api.post("/api/:project_id/proposal", uploadPDF,proposal_controller.createProposal)
api.patch("/api/:project_id/proposal/apporove", proposal_controller.approveProposal)
api.get("/api/:project_id/proposal",proposal_controller.getProposalByUser)
api.get("/api/proposals",proposal_controller.getProposalCounts)


module.exports = api
