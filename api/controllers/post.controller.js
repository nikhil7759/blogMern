import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.status(200).json(posts); // Return the posts
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
};

export const getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await prisma.post.findUnique({
            where: { id },
             include:{
                 postDetail: true,
                 user: {
                     select:{
                         username:true,
                        
                    }
                 },
             }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post); // Return the post
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get this post" });
    }
};

export const updatePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // if (post.userId !== tokenUserId) {
        //     return res.status(403).json({ message: "Not authorized" });
        // }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: req.body, // Update with request body
        });

        res.status(200).json(updatedPost); // Return updated post
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update post" });
    }
};
export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                user: {
                    connect: { id: tokenUserId }  // Connect to the existing user using tokenUserId
                },
                postDetail: {
                    create: body.postDetail
                }
            },
        });
        res.status(201).json(newPost); // Return newly created post
    } catch (err) {
        console.error("Post creation error:", err);
        res.status(500).json({ message: "Failed to create post", error: err.message });
    }
};

// export const addPost = async (req, res) => {
//     const body = req.body;
//     const tokenUserId = req.userId;

//     try {
//         const newPost = await prisma.post.create({
//             data: {
//                 ...body.postData,
//                 userId: tokenUserId,
//                 postDetail:{
//                     create: body.postDetail,

//                 }
                
//             },
//         });
//         res.status(201).json(newPost); // Return newly created post
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to create post" });
//     }
// };

export const deletePost = async (req, res) => {
    const id = req.params.id;

    try {
        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Delete related PostDetail records
        await prisma.postDetail.deleteMany({
            where: { postId: id }, // Adjust the field name as necessary
        });

        // Now delete the post
        await prisma.post.delete({
            where: { id },
        });

        res.status(204).json({ message: "Post deleted" }); // No content to return on successful deletion
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete post" });
    }
};


