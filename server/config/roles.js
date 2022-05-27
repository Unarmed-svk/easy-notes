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
    brand: allRights,
  },
  user: {
    profile: {
      "read:own": ["*", "!password", "!_id"],
      "update:own": ["firstname", "lastname"],
    },
    notes: {
      "read:own": ["notes"],
      "update:own": ["notes"],
      "delete:own": ["notes"],
    },
    brand: {
      "read:any": ["*"],
    },
  },
};

const roles = new AccessControll(grantsObj);

module.exports = { roles };
