const AccessControll = require("accesscontrol");

const allRights = {
  "create:any": ["*"],
  "read:any": ["*"],
  "update:any": ["*"],
  "delete:any": ["*"],
};

let grantsObj = {
  admin: {
    profile: allRights,
    notes: allRights,
  },
  user: {
    profile: {
      "read:own": ["*", "!password", "!_id"],
      "update:own": ["firstname", "lastname"],
      "delete:own": ["*"],
    },
    notes: {
      "read:own": ["notes", "notesCreated", "notesCompleted", "notesDeleted"],
      "update:own": ["notes"],
      "delete:own": ["notes"],
    },
  },
};

const roles = new AccessControll(grantsObj);

module.exports = { roles };
