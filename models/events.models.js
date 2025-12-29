import mongoose, { Schema as _Schema, model } from 'mongoose';
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
            type: _Schema.Types.ObjectId,
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
            type: _Schema.Types.ObjectId,
            ref: 'Signup',
        },
    }, { timestamps: true }
);


const Event = model('Events', eventSchema)

export default Event;