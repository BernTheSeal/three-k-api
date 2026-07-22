import z from "zod";

export const emailSchema = () => {
  let schema = z
    .email("Invalid email.")
    .max(255, "Email address must be at most 255 characters long.");

  return schema;
};
