import express from "express";

export default function postRoutes(pool) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { title, content } = req.body;
    const result = await pool.query(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.json(result.rows[0]);
  });

  router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  });

  router.get("/:id", async (req, res) => {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  });


  router.put("/:id", async (req, res) => {
    const { title, content } = req.body;
    const result = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, req.params.id]
    );
    res.json(result.rows[0]);
  });

  router.delete("/:id", async (req, res) => {
    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    res.json({ message: "Post deleted" });
  });

  return router;

}


