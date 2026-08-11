import prisma from "../../lib/prisma";

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  return prisma.category.create({ data });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findFirst({
    where: { id, isDeleted: false },
  });
};

export const updateCategory = async (
  id: number,
  data: { name?: string; description?: string },
) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const softDeleteCategory = async (id: number) => {
  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};
