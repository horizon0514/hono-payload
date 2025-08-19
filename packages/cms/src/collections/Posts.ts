import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const Posts: CollectionConfig = {
  slug: 'posts', // 对应数据库中的 posts 表
  admin: {
    useAsTitle: 'title',
    description: '文章管理',
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
      name: 'title',
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
      name: 'content',
      type: 'textarea', // 改为普通文本域，匹配数据库的text类型
      admin: {
        rows: 10,
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: '文章摘要',
      },
    },
    {
      name: 'author', // 直接使用数据库字段名
      type: 'relationship',
      relationTo: 'users', // 关联到 users 表
      admin: {
        description: '文章作者',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '是否发布',
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
