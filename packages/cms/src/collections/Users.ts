import type { CollectionConfig } from 'payload'

export const AdminUsers: CollectionConfig = {
  slug: 'admin-users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
