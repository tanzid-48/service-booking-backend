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
