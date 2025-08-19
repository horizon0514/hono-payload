import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const Categories: CollectionConfig = {
  slug: 'categories', // 对应数据库中的 categories 表
  admin: {
    useAsTitle: 'name',
    description: '分类管理',
  },

  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: uuidv4(),
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL友好的标识符',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: '分类描述',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
