import DevBuildError from "../../lib/DevBuildError.js";
import { InstanceMessageService } from "../instanceMessage/instanceMessage.service.js";

export const MessageService = {
  getMessagesByInstanceId: async (prisma, owner, instanceId, agentId) => {
    let targetInstanceId = instanceId;

    if (!targetInstanceId) {
      // Fallback to latest instance for GET
      const instance = await InstanceMessageService.getLatestInstance(
        prisma,
        owner,
        agentId
      );
      if (!instance) {
        return [];
      }
      targetInstanceId = instance.id;
    } else {
      // Verify instance belongs to user
      const instance = await prisma.instance.findFirst({
        where: { id: targetInstanceId, userId: owner.id },
      });

      if (!instance) {
        throw new DevBuildError("Instance not found", 404);
      }
    }

    return prisma.message.findMany({
      where: {
        instanceId: targetInstanceId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        role: true,
        content: true,
        docummentsUrls: true,
        docummentsPaths: true,
        voiceUrls: true,
        voicePaths: true,
        userRole: true,
      },
    });
  },

  createMessage: async (prisma, owner, data) => {
    const {
      instanceId,
      agentId,
      docummentsUrls,
      docummentsPaths,
      voiceUrls,
      voicePaths,
      ...messageData
    } = data;
    let targetInstanceId = instanceId;

    // If no instanceId, start a NEW context/instance
    if (!targetInstanceId) {
      if (!agentId) {
        throw new DevBuildError("agentId is required to start a new conversation", 400);
      }

      const truncatedName =
        messageData.content.split(" ").slice(0, 5).join(" ") +
        (messageData.content.split(" ").length > 5 ? "..." : "");

      const newInstance = await prisma.instance.create({
        data: {
          userId: owner.id,
          userRole: owner.role,
          agentId,
          name: truncatedName || "New Conversation",
        },
      });
      targetInstanceId = newInstance.id;
    } else {
      // Verify existing instance belongs to user
      const instance = await prisma.instance.findFirst({
        where: { id: targetInstanceId, userId: owner.id },
      });

      if (!instance) {
        throw new DevBuildError("Instance not found", 404);
      }

      // If it's a USER message and title is default, update it
      const messageCount = await prisma.message.count({
        where: { instanceId: targetInstanceId },
      });

      if (
        messageCount === 0 &&
        messageData.role === "USER" &&
        (instance.name === "New Conversation" || !instance.name)
      ) {
        const truncatedName =
          messageData.content.split(" ").slice(0, 5).join(" ") +
          (messageData.content.split(" ").length > 5 ? "..." : "");

        await prisma.instance.update({
          where: { id: targetInstanceId },
          data: { name: truncatedName },
        });
      }
    }

    return prisma.message.create({
      data: {
        ...messageData,
        instanceId: targetInstanceId,
        userRole: owner.role,
        docummentsUrls: docummentsUrls || [],
        docummentsPaths: docummentsPaths || [],
        voiceUrls: voiceUrls || [],
        voicePaths: voicePaths || [],
      },
    });
  },

  getAllMessages: async (prisma, owner) => {
    return prisma.message.findMany({
      where: {
        instance: { userId: owner.id },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        instance: {
          select: {
            id: true,
            name: true,
            agentId: true,
            agent: {
              select: {
                agentName: true,
              },
            },
          },
        },
      },
    });
  },

  getInstances: async (prisma, owner, agentId) => {
    return InstanceMessageService.getInstances(prisma, owner, agentId);
  },
};
