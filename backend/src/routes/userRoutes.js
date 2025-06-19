
import { Router } from "express";
const router=Router();

import syncUserController from "../controller/syncUserController.js";
import { createProjectController } from "../controller/createProjectController.js";
// import { requireAuth } from "@clerk/express";
import { auth } from "../middlewares/auth.js";
import { getAuth, requireAuth } from "@clerk/express";
import { getAllProjects } from "../controller/getAllProjects.js";
import { getCommits } from "../controller/getCommits.js";
import { addCommitsController } from "../controller/addCommits.js";
import { getProjectController } from "../controller/getProject.js";
import { addEmbeddings } from "../controller/addEmbeddings.js";
import { askQuestion } from "../controller/askQuestion.js";
import { saveAnswer } from "../controller/saveAnswer.js";
import { getQuestions } from "../controller/getQuestions.js";
import { archiveProject } from "../controller/archiveProject.js";
import { joinTeam } from "../controller/joinTeam.js";
import { getTeamMembers } from "../controller/getTeamMembers.js";
import { paymentController } from "../controller/payment/paymentController.js";
import { getCredits } from "../controller/getCredits.js";
import { addCredit } from "../controller/addCredit.js";
import { githubProxy } from "../controller/githubProxyForCommit.js";
// import { createProjectController } from "../controller/createProjectController.js";



router.post('/sync-user',syncUserController);
router.post('/create-project',auth,createProjectController);
router.get('/getAllProjects',auth,getAllProjects);
router.get('/getCommits/:projectId',auth,getCommits);
router.post('/addCommit',auth,addCommitsController);
router.get('/getProject/:projectId',auth,getProjectController);  //get single project by project id
router.post('/addEmbeddings',auth,addEmbeddings);
router.post('/askQuestion/:projectId',auth,askQuestion);
router.post('/saveanswer',auth,saveAnswer);
router.get('/getquestions/:projectId',auth,getQuestions);
router.put('/archiveproject/:projectId',auth,archiveProject);
router.get('/join/:projectId',joinTeam);
router.get('/teammembers/:projectId',auth,getTeamMembers);
router.post('/payment/createorder',paymentController);
router.get('/getcredits',auth,getCredits);
router.post('/addCredits',auth,addCredit);
router.get('/githubproxy',githubProxy);
export default router;

