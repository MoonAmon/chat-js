const Message = require('../models/message');
const User = require('../models/user');

const addMessage = async (content, authorId) => {
    try {
        const message = await Message.create({
            content,
            author: authorId
        });

        // Return message with user data
        return await Message.findOne({
            where: { id: message.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }]
        });
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
};

const getMessages = async () => {
    try {
        return await Message.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }],
            order: [['createdAt', 'ASC']]
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

module.exports = { addMessage, getMessages };