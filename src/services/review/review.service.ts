import prisma from "../../lib/prisma";

export const createReview = async (data: {
  rating: number;
  comment?: string;
  customerId: number;
  serviceId: number;
}) => {
  return prisma.review.create({ data });
};

export const getAllReviews = async () => {
  return prisma.review.findMany({
    where: { isDeleted: false },
    include: {
      customer: { select: { id: true, name: true } },
      service: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getReviewById = async (id: number) => {
  return prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: {
      customer: { select: { id: true, name: true } },
      service: { select: { id: true, title: true } },
    },
  });
};

export const updateReview = async (
  id: number,
  data: { rating?: number; comment?: string },
) => {
  return prisma.review.update({
    where: { id },
    data,
  });
};

export const softDeleteReview = async (id: number) => {
  return prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });
};
