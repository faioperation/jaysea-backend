import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";
import { MessageService } from "./messages.service.js";
import { envVars } from "../../config/env.js";

const getOwner = (req) => {
  return {
    id: req.user.id,
    isMobile: req.user.userType === "mobile",
  };
};

const getMessages = async (req, res, next) => {
  try {
    const owner = getOwner(req);
    const { instance_id } = req.params;
    const { instanceId: queryInstanceId, agentId } = req.query;
    
    const targetId = instance_id || queryInstanceId;
    
    const result = await MessageService.getMessagesByInstanceId(
      prisma,
      owner,
      targetId,
      agentId
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Conversation history retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const owner = getOwner(req);

    // Handle File Uploads
    let docummentsUrls = [];
    let docummentsPaths = [];
    let voiceUrls = [];
    let voicePaths = [];

    if (req.files) {
      if (req.files.documents) {
        req.files.documents.forEach((file) => {
          const normalizedPath = file.path.replace(/\\/g, "/");
          docummentsPaths.push(normalizedPath);
          docummentsUrls.push(`${envVars.BACKEND_URL}/${normalizedPath}`);
        });
      }
      if (req.files.voice) {
        req.files.voice.forEach((file) => {
          const normalizedPath = file.path.replace(/\\/g, "/");
          voicePaths.push(normalizedPath);
          voiceUrls.push(`${envVars.BACKEND_URL}/${normalizedPath}`);
        });
      }
    }

    const result = await MessageService.createMessage(prisma, owner, {
      ...req.body,
      docummentsUrls,
      docummentsPaths,
      voiceUrls,
      voicePaths,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Message created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const owner = getOwner(req);
    const result = await MessageService.getAllMessages(prisma, owner);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All messages retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getInstances = async (req, res, next) => {
  try {
    const owner = getOwner(req);
    const { agentId } = req.query;
    const result = await MessageService.getInstances(prisma, owner, agentId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Instances retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const MessageController = {
  getMessages,
  createMessage,
  getAllMessages,
  getInstances,
};
