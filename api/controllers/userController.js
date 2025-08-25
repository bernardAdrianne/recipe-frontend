import User from "../model/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import multer from "multer";
import { supabase } from "../utils/supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const myProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const editProfile= async (req, res, next) => {
    const { username, password, profilePic } = req.body;

    try {
       const updates = {};
        
       if (profilePic) updates.profilePic = profilePic;
        if (username) updates.username = username;
        if (password) {
            if (password.length < 8) {
                return next(errorHandler(400, 'Password must be at least 8 characters'));
            }
            const hashedPassword = bcryptjs.hashSync(password, 10);
            updates.password = hashedPassword;
        }

        if (Object.keys(updates).length === 0) {
            return next(errorHandler(400, 'No fields provided for update'));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProfile = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);

        if (!deletedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        res.clearCookie("access_token");
        res.status(200).json({ message: 'User deleted successfully'});
    } catch (error) {

    }
};

const storage = multer.memoryStorage();
export const upload = multer({ storage });


export const uploadProfilePicture = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      console.error('No file received');
      return next(errorHandler(400, 'No file uploaded'));
    }

    console.log("Uploading file:", file.originalname);

    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const userId = req.user.id;
    const filePath = `${userId}/${fileName}`; 

    const { error } = await supabase.storage
      .from('profile') 
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return next(errorHandler(500, 'Upload failed'));
    }

    const { data } = supabase.storage
      .from('profile')
      .getPublicUrl(filePath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: data.publicUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile picture updated successfully',
      user,
      url: data.publicUrl,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    next(error);
  }
};
