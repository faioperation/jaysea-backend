import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";
import { AdminService } from "./admin.service.js";

const getAllUsers = async (req, res, next) => {
  try {
    const result = await AdminService.getAllUsers(prisma);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMobileUsers = async (req, res, next) => {
  try {
    const result = await AdminService.getAllMobileUsers(prisma);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Mobile users retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserInstances = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getUserInstances(prisma, id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User instances retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllUsers,
  getAllMobileUsers,
  getUserInstances,
};
