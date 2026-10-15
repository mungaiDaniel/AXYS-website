// File: models/Role.js
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
      // Validation moved to pre-save hook to avoid require() issues
    },
    isSystem: {
      type: Boolean,
      default: false,
      // System roles (like Super Admin) cannot be deleted
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name before saving
roleSchema.pre('save', function() {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
});

// Instance method: Check if role has a specific permission
roleSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Static method: Get all active roles
roleSchema.statics.getActiveRoles = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method: Find by slug
roleSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

export default Role;
