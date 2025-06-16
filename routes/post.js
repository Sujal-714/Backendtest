import express from "express";

export default function postRoutes(pool) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { title, content } = req.body;
      const result = await pool.query(
        "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
        [title, content]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error("POST /api/posts error:", error);
      res.status(500).json({ message: "Failed to create post", error: error.message });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      console.error("GET /api/posts error:", error);
      res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(`GET /api/posts/${req.params.id} error:`, error);
      res.status(500).json({ message: "Failed to fetch post", error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const { title, content } = req.body;
      const result = await pool.query(
        "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
        [title, content, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(`PUT /api/posts/${req.params.id} error:`, error);
      res.status(500).json({ message: "Failed to update post", error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted" });
    } catch (error) {
      console.error(`DELETE /api/posts/${req.params.id} error:`, error);
      res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
  });

  return router;
}
