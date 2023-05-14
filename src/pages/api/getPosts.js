import nc from "next-connect";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";
import Post from "../models/Post";
// import db from "../models";
import { prisma } from "prisma/db/config";
import User from "../models/User";

dotenv.config();
const handler = nc();

export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    include: {
      likes: {
        select: {
          postId: true,
          userId: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          followers: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return posts;
}
handler.get(async (req, res) => {
  const posts = await getAllPosts();

  res.send(posts);
});
export default handler;
