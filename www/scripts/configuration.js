"use strict";

 angular.module('config', [])

.constant('ENV', {
	name:'development',
	dataProvider:'REMOTE',
	firebaseUrl:'https://business-directory.firebaseio.com/',
	youtubeKey:'AIzaSyDael5MmCQa1GKQNKQYypmBeB08GATgSEo',
	ionicPrivateKey:'76bfc83c28ac08a93fe16515b2fd268810c8fd2cec42c821',
	ionicPublicKey:'5fcee6114e15fe68d8b16eccc3d328126f5f2c2b342cf294',
	ionicAppId:'a73f0db6',
	gcmId:'achou-1283'})

;