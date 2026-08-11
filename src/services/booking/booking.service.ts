import prisma from "../../lib/prisma";

export const createBooking = async (data: {
  bookingDate: Date;
  customerId: number;
  serviceId: number;
}) => {
  return prisma.booking.create({ data });
};

export const getAllBookings = async () => {
  return prisma.booking.findMany({
    where: { isDeleted: false },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      service: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getBookingById = async (id: number) => {
  return prisma.booking.findFirst({
    where: { id, isDeleted: false },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      service: true,
    },
  });
};

export const updateBookingStatus = async (
  id: number,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
) => {
  return prisma.booking.update({
    where: { id },
    data: { status },
  });
};

export const softDeleteBooking = async (id: number) => {
  return prisma.booking.update({
    where: { id },
    data: { isDeleted: true },
  });
};
