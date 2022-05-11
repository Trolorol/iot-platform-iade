const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();


//ACTIONS ROUTES//

router.post('/switch_state', controllers.activateDevice)

//LOGIN ROUTES//
router.post('/login', controllers.simpleLogin);
router.post('/signup', controllers.simpleSignup);
router.post('/delete_account', controllers.simpleDeleteAccount);

//USERS ROUTES//

router.get('/users/devices', controllers.getDevicesFromUserId)

router.post('/users', controllers.createUser)

router.get('/users', controllers.getAllUsers)

router.get('/users/:id', controllers.getUserById)

router.put('/users/:id', controllers.updateUser)

router.delete('/users/:id', controllers.deleteUser)



//DEVICES ROUTES//

router.post('/devices', controllers.createDevice)

router.get('/devices', controllers.getAllDevices)

router.get('/devices/:id', controllers.getDeviceById)

router.put('/devices/:id', controllers.updateDevice)

router.delete('/devices/:id', controllers.deleteDevice)



// Screen Routes 
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});





module.exports = router