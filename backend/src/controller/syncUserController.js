import prisma from "../prismaClient.js";

const syncUser = async (req, res) => {
    console.log('Received body:', req.body);
    const { userId, emailAddress, firstName, lastName, imageUrl } = req.body;

    try {
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: { emailAddress, firstName, lastName, imageUrl },
            create: { clerkId: userId, emailAddress, firstName, lastName, imageUrl }
        });
        console.log(`User upserted via sync: ${userId}`);
        res.status(200).json({ message: 'User Synced Successfully' });
    } catch (error) {
        console.error('Error Syncing user: ', error);
        res.status(500).json({ error: 'failed to sync user' });
    }
}

export default syncUser;