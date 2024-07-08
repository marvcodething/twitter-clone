import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        //find all notifications where the to field is equal to the userId
        const notifications = await Notification.find({ to: userId}).populate({
            path: "from",
            select: "username profileImg",
        });
        //update all notifications to read
        await Notification.updateMany({to:userId},{read:true});

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        await Notification.deleteMany({to: userId});

    } catch (error) {
        console.log("Error in deleteNotifications: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deleteOneNotification = async (req, res) => {
    try {
        const userId = req.userId;

        const notificationId = req.params.id;

        const notification = await Notification.findByIdAndDelete(notificationId);
        
        if (!notification) {
            return res.status(404).json({message: "Notification not found"});
        }
        
        if (notification.toString() !== userId.toString()) {
            return res.status(403).json({message: "You are not authorized to delete this notification"});
        }
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message: "Notification deleted successfully"});
    } catch (error) {
        console.log("Error in deleteOneNotification: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};