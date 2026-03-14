import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";
import { MessageService } from "./messages.service.js";

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
    const result = await MessageService.createMessage(
      prisma,
      owner,
      req.body
    );

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
