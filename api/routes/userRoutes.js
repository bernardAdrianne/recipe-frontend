import { myProfile, editProfile, deleteProfile, upload, uploadProfilePicture } from "../controllers/userController.js";
import { verifyToken } from '../middleware/verifyToken.js';
import express from 'express';


const router = express.Router();

router.get('/', verifyToken, myProfile);
router.put('/editprofile', verifyToken, editProfile);
router.delete('/', verifyToken, deleteProfile);
router.post("/upload-profile-picture", verifyToken, upload.single('profilePic'), uploadProfilePicture);

export default router;