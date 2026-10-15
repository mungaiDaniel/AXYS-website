import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Admin',
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
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

// Instance method: Get populated role with permissions
AdminSchema.methods.getRole = async function() {
  const Role = mongoose.model('Role');
  return await Role.findById(this.role);
};

// Instance method: Check if user has a specific permission
AdminSchema.methods.hasPermission = async function(permission) {
  const role = await this.getRole();
  if (!role) return false;
  return role.hasPermission(permission);
};

// Instance method: Get all user permissions
AdminSchema.methods.getPermissions = async function() {
  const role = await this.getRole();
  if (!role) return [];
  return role.permissions;
};

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
