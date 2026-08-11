import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
  phone?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "CUSTOMER",
      phone: data.phone,
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email, isDeleted: false },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id, isDeleted: false },
  });
};

// ============ Admin CRUD functions ============

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      // password field is intentionally excluded for security reasons
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserByIdForAdmin = async (id: number) => {
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (
  id: number,
  data: {
    name?: string;
    phone?: string;
    role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
  },
) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const softDeleteUser = async (id: number) => {
  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};
