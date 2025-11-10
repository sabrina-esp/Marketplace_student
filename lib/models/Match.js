import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    metadata: { type: Object, default: {} }
  },
  {
    timestamps: true
  }
);

// ensure unique pair (simple approach: users array sorted before save)
MatchSchema.pre('save', function(next) {
  if (this.users && this.users.length === 2) {
    this.users = this.users.map(String).sort();
  }
  next();
});

const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);
export default Match;
