import { prisma } from "../src/lib/prisma";

async function main() {
  const posts = [
    { title: "Post 1", content: "Test content 1." },
    { title: "Post 2", content: "Test content 2." },
    { title: "Post 3", content: "Test content 3." },
  ];

  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];

    await prisma.post.create({ data: post });
  }
}

main().catch((e) => {
  console.error(e);
});
