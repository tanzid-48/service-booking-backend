import prisma from "../../lib/prisma";

export const createService = async (data: {
  title: string;
  description?: string;
  price: number;
  categoryId: number;
  providerId: number;
}) => {
  return prisma.service.create({ data });
};

export const getAllServices = async () => {
  return prisma.service.findMany({
    where: { isDeleted: false },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getServiceById = async (id: number) => {
  return prisma.service.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
      reviews: true,
    },
  });
};

export const updateService = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    price?: number;
    categoryId?: number;
  },
) => {
  return prisma.service.update({
    where: { id },
    data,
  });
};

export const softDeleteService = async (id: number) => {
  return prisma.service.update({
    where: { id },
    data: { isDeleted: true },
  });
};
