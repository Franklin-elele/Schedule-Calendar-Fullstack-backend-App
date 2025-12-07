const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > new Date();
                }
            }
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.startDate
                }
            }
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Signup',
            required: true,
        },
        assignedTo: {
            type: [String],
            ref: 'Signup',
            default: [],
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurrencePattern: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Signup',
        },
    }, { timestamps: true }
);


const Event = mongoose.model('Events', eventSchema)

module.exports = Event;