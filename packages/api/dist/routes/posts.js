import { Hono } from 'hono';
import { eq, desc, count, and } from 'drizzle-orm';
import { db, posts, users } from '@hono-payload/db/db';
export const postsRouter = new Hono();
// GET /api/posts - Get all posts with pagination and optional filters
postsRouter.get('/', async (c) => {
    try {
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 10;
        const published = c.req.query('published');
        const offset = (page - 1) * limit;
        // Build where conditions
        const whereConditions = [];
        if (published !== undefined) {
            whereConditions.push(eq(posts.published, published === 'true'));
        }
        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
        // Get total count
        const [{ totalCount }] = await db.select({ totalCount: count() }).from(posts).where(whereClause);
        // Get posts with author information
        const postList = await db
            .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            excerpt: posts.excerpt,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            author: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(whereClause)
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);
        const response = {
            success: true,
            data: postList,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
        return c.json(response);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return c.json({ success: false, error: 'Failed to fetch posts' }, 500);
    }
});
// GET /api/posts/:id - Get post by ID
postsRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const [post] = await db
            .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            excerpt: posts.excerpt,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            author: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.id, id))
            .limit(1);
        if (!post) {
            return c.json({ success: false, error: 'Post not found' }, 404);
        }
        const response = {
            success: true,
            data: post,
        };
        return c.json(response);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        return c.json({ success: false, error: 'Failed to fetch post' }, 500);
    }
});
// GET /api/posts/slug/:slug - Get post by slug
postsRouter.get('/slug/:slug', async (c) => {
    try {
        const slug = c.req.param('slug');
        const [post] = await db
            .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            excerpt: posts.excerpt,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            author: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.slug, slug))
            .limit(1);
        if (!post) {
            return c.json({ success: false, error: 'Post not found' }, 404);
        }
        const response = {
            success: true,
            data: post,
        };
        return c.json(response);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        return c.json({ success: false, error: 'Failed to fetch post' }, 500);
    }
});
// POST /api/posts - Create new post
postsRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const newPostData = {
            title: body.title,
            slug: body.slug,
            content: body.content,
            excerpt: body.excerpt,
            authorId: body.authorId,
            published: body.published ?? false,
        };
        const [createdPost] = await db.insert(posts).values(newPostData).returning();
        const response = {
            success: true,
            data: createdPost,
            message: 'Post created successfully',
        };
        return c.json(response, 201);
    }
    catch (error) {
        console.error('Error creating post:', error);
        return c.json({ success: false, error: 'Failed to create post' }, 500);
    }
});
// PUT /api/posts/:id - Update post
postsRouter.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const updateData = {
            ...body,
            updatedAt: new Date(),
        };
        const [updatedPost] = await db.update(posts).set(updateData).where(eq(posts.id, id)).returning();
        if (!updatedPost) {
            return c.json({ success: false, error: 'Post not found' }, 404);
        }
        const response = {
            success: true,
            data: updatedPost,
            message: 'Post updated successfully',
        };
        return c.json(response);
    }
    catch (error) {
        console.error('Error updating post:', error);
        return c.json({ success: false, error: 'Failed to update post' }, 500);
    }
});
// DELETE /api/posts/:id - Delete post
postsRouter.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const [deletedPost] = await db.delete(posts).where(eq(posts.id, id)).returning();
        if (!deletedPost) {
            return c.json({ success: false, error: 'Post not found' }, 404);
        }
        const response = {
            success: true,
            message: 'Post deleted successfully',
        };
        return c.json(response);
    }
    catch (error) {
        console.error('Error deleting post:', error);
        return c.json({ success: false, error: 'Failed to delete post' }, 500);
    }
});
