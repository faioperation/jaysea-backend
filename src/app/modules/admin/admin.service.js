export const AdminService = {
  getAllUsers: async (prisma) => {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getAllMobileUsers: async (prisma) => {
    return prisma.mobileUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getUserInstances: async (prisma, id) => {
    return prisma.instance.findMany({
      where: {
        OR: [{ userId: id }, { mobileUserId: id }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        agent: {
          select: {
            agentName: true,
            id : true
          },
        },
      },
    });
  },
};
