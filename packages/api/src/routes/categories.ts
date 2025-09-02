import { Hono } from "hono";
import { eq, desc, count } from "drizzle-orm";
import { db, categories } from "@hono-payload/db/db";
import type { Category, NewCategory, ApiResponse, PaginatedResponse } from "@hono-payload/db/types";

export const categoriesRouter = new Hono();

// GET /api/categories - Get all categories with pagination
categoriesRouter.get("/", async (c) => {
  try {
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [{ totalCount }] = await db.select({ totalCount: count() }).from(categories);

    // Get categories with pagination
    const categoryList = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt))
      .limit(limit)
      .offset(offset);

    const response: PaginatedResponse<Category> = {
      success: true,
      data: categoryList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return c.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ success: false, error: "Failed to fetch categories" }, 500);
  }
});

// GET /api/categories/:id - Get category by ID
categoriesRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);

    if (!category) {
      return c.json({ success: false, error: "Category not found" }, 404);
    }

    const response: ApiResponse<Category> = {
      success: true,
      data: category,
    };

    return c.json(response);
  } catch (error) {
    console.error("Error fetching category:", error);
    return c.json({ success: false, error: "Failed to fetch category" }, 500);
  }
});

// GET /api/categories/slug/:slug - Get category by slug
categoriesRouter.get("/slug/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");

    const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);

    if (!category) {
      return c.json({ success: false, error: "Category not found" }, 404);
    }

    const response: ApiResponse<Category> = {
      success: true,
      data: category,
    };

    return c.json(response);
  } catch (error) {
    console.error("Error fetching category:", error);
    return c.json({ success: false, error: "Failed to fetch category" }, 500);
  }
});

// POST /api/categories - Create new category
categoriesRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const newCategoryData: NewCategory = {
      name: body.name,
      slug: body.slug,
      description: body.description,
    };

    const [createdCategory] = await db.insert(categories).values(newCategoryData).returning();

    const response: ApiResponse<Category> = {
      success: true,
      data: createdCategory,
      message: "Category created successfully",
    };

    return c.json(response, 201);
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ success: false, error: "Failed to create category" }, 500);
  }
});

// PUT /api/categories/:id - Update category
categoriesRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const updateData: Partial<NewCategory> = {
      ...body,
      updatedAt: new Date(),
    };

    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return c.json({ success: false, error: "Category not found" }, 404);
    }

    const response: ApiResponse<Category> = {
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    };

    return c.json(response);
  } catch (error) {
    console.error("Error updating category:", error);
    return c.json({ success: false, error: "Failed to update category" }, 500);
  }
});

// DELETE /api/categories/:id - Delete category
categoriesRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const [deletedCategory] = await db.delete(categories).where(eq(categories.id, id)).returning();

    if (!deletedCategory) {
      return c.json({ success: false, error: "Category not found" }, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Category deleted successfully",
    };

    return c.json(response);
  } catch (error) {
    console.error("Error deleting category:", error);
    return c.json({ success: false, error: "Failed to delete category" }, 500);
  }
});
