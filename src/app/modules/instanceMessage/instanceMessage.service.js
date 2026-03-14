import DevBuildError from "../../lib/DevBuildError.js";

export const InstanceMessageService = {
  createInstance: async (prisma, owner, data) => {
    const ownerData = owner.isMobile ? { mobileUserId: owner.id } : { userId: owner.id };
    return prisma.instance.create({
      data: {
        ...data,
        ...ownerData,
      },
    });
  },

  getInstances: async (prisma, owner, agentId) => {
    const where = owner.isMobile ? { mobileUserId: owner.id } : { userId: owner.id };
    if (agentId) {
      where.agentId = agentId;
    }
    return prisma.instance.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  getLatestInstance: async (prisma, owner, agentId) => {
    const where = owner.isMobile ? { mobileUserId: owner.id } : { userId: owner.id };
    if (agentId) {
      where.agentId = agentId;
    }
    return prisma.instance.findFirst({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  updateInstance: async (prisma, owner, id, data) => {
    const where = owner.isMobile ? { id, mobileUserId: owner.id } : { id, userId: owner.id };
    const instance = await prisma.instance.findFirst({
      where,
    });

    if (!instance) {
      throw new DevBuildError("Instance not found", 404);
    }

    return prisma.instance.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  },

  deleteInstance: async (prisma, owner, id) => {
    const where = owner.isMobile ? { id, mobileUserId: owner.id } : { id, userId: owner.id };
    const instance = await prisma.instance.findFirst({
      where,
    });

    if (!instance) {
      throw new DevBuildError("Instance not found", 404);
    }

    return prisma.instance.delete({
      where: { id },
    });
  },
};
