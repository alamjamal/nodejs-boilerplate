const express = require('express');
const {agencyController} = require('../controller')
const { verifyAccessToken } = require('../_helper/jwt_helper')


const router = express.Router();

// router
//   .route('/')
//   .get(agencyController.getAcency)
//   .post(agencyController.createAgency);

router.get('/view',verifyAccessToken, agencyController.getAgency )
router.post('/create', agencyController.createAgency )
router.patch('/update/:id', agencyController.updateClient )


router.post('/login', agencyController.login )
router.delete('/logout', agencyController.logOut)
router.post('/refresh', agencyController.refreshToken )


module.exports = router;