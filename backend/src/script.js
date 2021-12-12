// 1
const { PrismaClient } = require("@prisma/client")



// 2
const prisma = new PrismaClient()

// 3 function to send queries to the database
async function main() {
    const newPost = await prisma.post.create({
        data: {
            content: "Fullstack tutorial for GraphQL",
            url: "www.howtographql.com"
        },
    })

    // PrismaClient assigns your model in the object
    const allLinks = await prisma.post.findMany();
    console.log(allLinks)
}

// 4 call main()
main()
    .catch(e => {
        throw e
    })
    // 5 close db connection when the script termintates
    .finally(async () => {
        await prisma.$disconnect()
    })