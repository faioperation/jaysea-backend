import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";
import { InstanceMessageService } from "./instanceMessage.service.js";

const getOwner = (req) => {
  return {
    id: req.user.id,
    isMobile: req.user.userType === "mobile",
  };
};

const createInstance = async (req, res, next) => {
  try {
    const owner = getOwner(req);
    const result = await InstanceMessageService.createInstance(
      prisma,
      owner,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Instance created successfully",
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
    console.log(`🔍 Fetching instances for ${owner.isMobile ? 'MobileUser' : 'User'} ID: ${owner.id}, Agent: ${agentId}`);
    const result = await InstanceMessageService.getInstances(prisma, owner, agentId);
    console.log(`✅ Found ${result.length} instances`);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Instances retrieved successfully",
      data: result,
      debug: {
        ownerId: owner.id,
        ownerType: req.user.userType,
        isMobile: owner.isMobile
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateInstance = async (req, res, next) => {
  try {
    const owner = getOwner(req);
    const { id } = req.params;
    const result = await InstanceMessageService.updateInstance(prisma, owner, id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Instance updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInstance = async (req, res, next) => {
  try {
    const owner = getOwner(req);
    const { id } = req.params;
    const result = await InstanceMessageService.deleteInstance(prisma, owner, id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Instance deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const InstanceMessageController = {
  createInstance,
  getInstances,
  updateInstance,
  deleteInstance,
};
