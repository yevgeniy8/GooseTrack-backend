const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post('save', (error, _, next) => {
    error.status = 400;
    next();
});

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
