import { Schema, model, models } from "mongoose";

const BracketGroupSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: [true, "Tournament ID is required."],
    },

    name: {
      type: String,
      required: [true, "Bracket group name is required."],
    },

    order: {
      type: Number,
      required: true,
    },

    bracketSide: {
      type: String,
      enum: ["winner", "loser"],
      default: "winner",
    },
  },
  { timestamps: true }
);

// Ensure unique group names per tournament
BracketGroupSchema.index({ tournament: 1, name: 1 }, { unique: true });

export const BracketGroup =
  models.BracketGroup || model("BracketGroup", BracketGroupSchema);

/**
 * This is how we can query the bracket groups for a tournament:
 *
 * Match.find({ tournament: id }).populate('bracketGroup').sort({ 'bracketGroup.order': 1 })
 */

//   {
//   "_id": "668b9a3f8d9432b4b06dbfa9",
//   "tournament": "668b97ff2cbb14a0145a62ed",
//   "name": "Upper Bracket Round 1",
//   "order": 1,
//   "bracketSide": "winner",
//   "createdAt": "2025-07-09T18:45:23.123Z",
//   "updatedAt": "2025-07-09T18:45:23.123Z",
//   "__v": 0
// }

// Double Elimitnation Bracket Example
// [
//   {
//     "name": "Upper Bracket Round 1",
//     "order": 1,
//     "bracketSide": "winner"
//   },
//   {
//     "name": "Upper Bracket Semifinals",
//     "order": 2,
//     "bracketSide": "winner"
//   },
//   {
//     "name": "Upper Bracket Final",
//     "order": 3,
//     "bracketSide": "winner"
//   },
//   {
//     "name": "Lower Bracket Round 1",
//     "order": 4,
//     "bracketSide": "loser"
//   },
//   {
//     "name": "Lower Bracket Final",
//     "order": 5,
//     "bracketSide": "loser"
//   },
//   {
//     "name": "Grand Final",
//     "order": 6,
//     "bracketSide": "winner"
//   }
// ]
