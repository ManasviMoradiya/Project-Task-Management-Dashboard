const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },

  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },

  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
}, 
);

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Task').deleteMany({ project: this._id });
  next();  // Continue with deleting the project
});

ProjectSchema.virtual('tasks', {
  ref: 'Task',           
  localField: '_id',   
  foreignField: 'project', 
  justOne: false       
});

module.exports = mongoose.model('Project', ProjectSchema);

