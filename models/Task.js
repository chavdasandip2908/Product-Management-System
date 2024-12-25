const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    createAt: { type: Date, default: Date.now },
    modifyAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
