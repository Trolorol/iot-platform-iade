const { Router } = require("express");
const controllers = require("../controllers");
const router = Router();

//ACTIONS ROUTES//

router.post("/switch_state", controllers.activateDevice);
router.post("/switch_group_state", controllers.activateGroup);
router.post("/fetch_devices", controllers.fetchDevices);

//LOGIN ROUTES//
router.post("/login", controllers.simpleLogin);
router.post("/signup", controllers.simpleSignup);
router.post("/delete_account", controllers.simpleDeleteAccount);

//Group Routes//

router.get("/groups/:user_id", controllers.getGroupsFromUserId);

router.post("/groups", controllers.createGroup);
router.delete("/groups/:id", controllers.deleteGroup);
//USERS ROUTES//

router.get("/users/devices/:user_id", controllers.getDevicesFromUserId);

router.post("/users", controllers.createUser);

router.get("/users", controllers.getAllUsers);

router.get("/users/:id", controllers.getUserById);

router.put("/users/:id", controllers.updateUser);

router.delete("/users/:id", controllers.deleteUser);

//DEVICES ROUTES//

router.post("/devices", controllers.createDevice);

router.get("/devices", controllers.getAllDevices);

router.get("/devices/:id", controllers.getDeviceById);

router.put("/devices/:id", controllers.updateDevice);

router.delete("/devices/:id", controllers.deleteDevice);

// Screen Routes
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

module.exports = router;