import { Hono } from 'hono'
import { eq, desc, count } from 'drizzle-orm'
import { db, users } from '@hono-payload/db/db'
import type { User, NewUser, ApiResponse, PaginatedResponse } from '@hono-payload/db/types'

export const usersRouter = new Hono()

// GET /api/users - Get all users with pagination
usersRouter.get('/', async (c) => {
  try {
    const page = Number(c.req.query('page')) || 1
    const limit = Number(c.req.query('limit')) || 10
    const offset = (page - 1) * limit

    // Get total count
    const [{ totalCount }] = await db.select({ totalCount: count() }).from(users)

    // Get users with pagination
    const userList = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset)

    const response: PaginatedResponse<User> = {
      success: true,
      data: userList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }

    return c.json(response)
  } catch (error) {
    console.error('Error fetching users:', error)
    return c.json({ success: false, error: 'Failed to fetch users' }, 500)
  }
})

// GET /api/users/:id - Get user by ID
usersRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    }

    return c.json(response)
  } catch (error) {
    console.error('Error fetching user:', error)
    return c.json({ success: false, error: 'Failed to fetch user' }, 500)
  }
})

// POST /api/users - Create new user
usersRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const newUserData: NewUser = {
      email: body.email,
      name: body.name,
      avatar: body.avatar,
      role: body.role || 'user',
      isActive: body.isActive ?? true,
    }

    const [createdUser] = await db.insert(users).values(newUserData).returning()

    const response: ApiResponse<User> = {
      success: true,
      data: createdUser,
      message: 'User created successfully',
    }

    return c.json(response, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    return c.json({ success: false, error: 'Failed to create user' }, 500)
  }
})

// PUT /api/users/:id - Update user
usersRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const updateData: Partial<NewUser> = {
      ...body,
      updatedAt: new Date(),
    }

    const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, id)).returning()

    if (!updatedUser) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    }

    return c.json(response)
  } catch (error) {
    console.error('Error updating user:', error)
    return c.json({ success: false, error: 'Failed to update user' }, 500)
  }
})

// DELETE /api/users/:id - Delete user
usersRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning()

    if (!deletedUser) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    }

    return c.json(response)
  } catch (error) {
    console.error('Error deleting user:', error)
    return c.json({ success: false, error: 'Failed to delete user' }, 500)
  }
})
