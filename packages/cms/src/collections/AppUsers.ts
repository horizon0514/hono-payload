import type { CollectionConfig } from "payload";
import { v4 as uuidv4 } from "uuid";

export const AppUsers: CollectionConfig = {
  slug: "users", // 对应数据库中的 users 表
  admin: {
    useAsTitle: "email",
    description: "应用前端用户",
  },

  fields: [
    {
      name: "id",
      type: "text",
      defaultValue: uuidv4(),
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "avatar",
      type: "textarea",
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      defaultValue: "user",
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "用户是否激活",
      },
    },
    {
      name: "createdAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "updatedAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
};
