import z from "zod";

export const emailSchema = () => {
  return z.email("Invalid email!").max(255, "Email address must be at most 255 characters long.");
};
