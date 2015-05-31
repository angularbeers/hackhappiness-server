angular.module("app",["ionic","ngResource","ngMessages","ngCookies","validation.match","app.config","app.controllers","app.services","app.directives"]).run(["$ionicPlatform",function(n){n.ready(function(){window.cordova&&window.cordova.plugins&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleLightContent()})}]).config(["$stateProvider","$urlRouterProvider","uiGmapGoogleMapApiProvider",function(n,e,t){n.state("app",{url:"","abstract":!0,templateUrl:"templates/tabs.html"}).state("app.map",{url:"/map",views:{"tab-map":{templateUrl:"templates/tab-map.html",controller:"MapCtrl"}}}).state("app.trending",{url:"/trending",resolve:{happinessRange:function(){return[1,2,3,4,5]}},views:{"tab-trending":{templateUrl:"templates/tab-trending.html",controller:"TrendingCtrl"}}}).state("app.about",{url:"/about",views:{"tab-about":{templateUrl:"templates/tab-about.html",controller:"AboutCtrl"}}}).state("app.account",{url:"/account",resolve:{happinessRange:function(){return[1,2,3,4,5]}},views:{"tab-account":{templateUrl:"templates/tab-account.html",controller:"AccountCtrl"}}}),e.otherwise("/map")}]),angular.module("app.controllers",["uiGmapgoogle-maps"]).controller("MapCtrl",["$scope","GeoService","MarkersService","uiGmapIsReady",function(n,e,t,a){a.promise(1).then(function(t){t.forEach(function(t){ionic.Platform.ready(function(){e.getCurrentPosition(function(e){n.map.control.refresh({latitude:e.coords.latitude,longitude:e.coords.longitude})})})})});var i=function(e){"function"==typeof n.markers.control.updateModels&&n.markers.control.updateModels(t.getFakeMarkers(e.data.map.center.lat(),e.data.map.center.lng()))};n.markers={models:[],control:{}},n.map=e.map,n.map.events={bounds_changed:i}}]).controller("TrendingCtrl",["$scope","$ionicModal","$state","Users","Happinesses","happinessRange",function(n,e,t,a,i,s){n.happinesses=[],n.happinessRange=s,n.happinessRangeMin=n.happinessRange[0],n.happinessRangeMax=n.happinessRange[n.happinessRange.length-1],i.get({$sort:{createdDate:-1}}).then(function(e){n.happinesses=e.data}),e.fromTemplateUrl("templates/addHappinessModal.html",{scope:n}).then(function(e){n.modal=e}),n.closeAddHappiness=function(){n.modal.hide()},n.openAddHappiness=function(){a.current().then(n.modal.show)["catch"](function(){t.go("app.account")})}}]).controller("AboutCtrl",["$scope",function(n){}]).controller("AccountCtrl",["$scope","$ionicModal","$cookies","Users","Happinesses","happinessRange",function(n,e,t,a,i,s){var o,r=function(){return a.current().then(function(e){n.user=e,l()})["catch"](function(e){n.login()})},l=function(){i.get({user:n.user.id,$sort:{createdDate:-1}}).then(function(e){n.happinesses=e.data})},p=function(e){n.user=e,n.auth.data={},o.$setPristine(),l(),n.closeAuth(),o=null},c=function(){t.sid=null,n.user=null};n.$on("$ionicView.beforeEnter",r),n.happinessRange=s,n.auth={action:"login"},n.auth.setAuthAction=function(e){n.auth.action=e},e.fromTemplateUrl("templates/modal-auth.html",{scope:n}).then(function(e){n.auth.modal=e}),n.login=function(){n.auth.setAuthAction("login"),n.auth.modal.show()},n.register=function(){n.auth.setAuthAction("register"),n.auth.modal.show()},n.closeAuth=function(){n.auth.modal.hide()},n.doRegister=function(e){o=e,e.$valid&&a.register(n.auth.data).then(p)["catch"](console.error)},n.doLogin=function(e){o=e,e.$valid&&a.login(n.auth.data).then(p)["catch"](console.error)},n.doLogout=function(){a.logout().then(c)["catch"](console.error)}}]).controller("LoginCtrl",["$scope","$ionicHistory",function(n,e){}]).controller("RegisterCtrl",["$scope","$ionicHistory",function(n,e){}]),angular.module("app.services",["dpd","ngCookies"]).factory("Users",["dpd","$cookies","$q",function(n,e,t){var a=n.users;return a.current=function(){var n=t.defer();return a.get("me").success(function(t){t?(e.sid=t.id,n.resolve(t)):n.reject()}).error(n.reject),n.promise},a.register=function(n){var i=t.defer();return a.post(n).success(function(n){e.sid=n.id,a.current().then(i.resolve)["catch"](i.reject)}).error(i.reject),i.promise},a.login=function(n){var i=t.defer();return a.exec("login",n).success(function(n){e.sid=n.id,a.current().then(i.resolve)["catch"](i.reject)}).error(i.reject),i.promise},a.logout=function(){var n=t.defer();return a.exec("logout").success(function(t){e.sid=null,n.resolve()}).error(n.reject),n.promise},a}]).factory("Happinesses",["dpd",function(n){return n.happinesses}]).factory("GeoService",["$resource",function(n){return{getCurrentPosition:function(n){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){n.call(null,e)}):alert("Unable to locate current position")},map:{center:{latitude:41.4,longitude:2.16},zoom:14,control:{},bounds:{}}}}]).factory("MarkersService",["$resource",function(n){return{getFakeMarkers:function(n,e){for(var t=[],a=function(n,e,t,a){void 0===a&&(a="id");var i=e+.01*Math.random(),s=t+.01*Math.random(),o={latitude:i,longitude:s,title:"m"+n,icon:"img/icon.png",options:{labelContent:"HackHappiness",labelClass:"label-background"}};return o[a]=n,o},i=0;3>i;i++)t.push(a(i,n,e));return t}}}]),angular.module("app.directives",[]).directive("hackhappinesAddhackhappines",["Happinesses",function(n){return{restrict:"E",replace:!0,templateUrl:"templates/addHappiness.html",compile:function(e,t){return function(e){e.addHappiness=function(){n.post(e.happinessData).success(e.closeAddHappiness)};var t;e.startHappiness=function(){i(),t=setInterval(i,a)},e.stopHappiness=function(){clearInterval(t),e.isHappinessLevelSet=!0};var a=500,i=function(){e.happinessData.level<e.happinessRangeMax&&e.happinessData.level++};e.initHappinesData=function(){e.happinessData={level:0,message:""},e.isHappinessLevelSet=!1},e.initHappinesData()}}}}]),angular.module("app").run(["$templateCache",function(n){n.put("templates/addHappiness.html",'<div>\n  <div class="text-center padding-vertical" ng-hide="isHappinessLevelSet">\n    <button type="button" class="button button-large icon ion-happy" on-touch="startHappiness()" on-release="stopHappiness()"></button>\n  </div>\n  <form ng-submit="addHappiness()" class="list" ng-show="isHappinessLevelSet">\n    <div class="item range">\n      <i class="icon ion-happy-outline"></i>\n      <input type="range" ng-model="happinessData.level" min="{{happinessRangeMin}}" max="{{happinessRangeMax}}" step="1">\n      <i class="">{{happinessData.level}}</i>\n    </div>\n    <label class="item item-input item-stacked-label">\n      <span class="input-label">What is making you so happy?</span>\n      <textarea type="text" ng-model="happinessData.message" placehoder="#Hackhappines"></textarea>\n    </label>\n    <label class="item">\n      <button class="button button-block button-positive" type="submit">Submit</button>\n    </label>\n  </form>\n</div>'),n.put("templates/addHappinessModal.html",'<ion-modal-view>\n  <ion-header-bar>\n    <h1 class="title">Happiness</h1>\n    <div class="buttons">\n      <button class="button button-clear" ng-click="closeAddHappiness()">Close</button>\n    </div>\n  </ion-header-bar>\n  <ion-content>\n    <hackhappines-addhackhappines></hackhappines-addhackhappines>\n  </ion-content>\n  </ion-content>\n</ion-modal-view>\n'),n.put("templates/modal-auth-login.html",'<form name="loginForm" ng-submit="doLogin(loginForm)" novalidate>\n	<div class="list">\n		<label class="item item-input item-floating-label" ng-class="{\n			\'has-error\': loginForm.username.$dirty && loginForm.username.$invalid\n		}">\n			<span class="input-label">Email</span>\n			<input type="text" name="username" ng-model="auth.data.username" ng-minlength="6" ng-maxlength="255" required placeholder="Email">\n		</label>\n		<div class="item form-errors" ng-messages="loginForm.username.$error" role="alert" ng-show="loginForm.username.$dirty && loginForm.username.$invalid">\n			<div class="form-error" ng-message="required">Email is required</div>\n			<div class="form-error" ng-message="minlength, maxlength">Your email must be between 6 and 255 characters long</div>\n		</div>\n		<label class="item item-input item-floating-label" ng-class="{\n			\'has-error\': loginForm.password.$dirty && loginForm.password.$invalid\n		}">\n			<span class="input-label">Password</span>\n			<input type="password" name="password" ng-model="auth.data.password" ng-minlength="6"required placeholder="Password">\n		</label>\n		<div class="item form-errors" ng-messages="loginForm.password.$error" role="alert" ng-show="loginForm.password.$dirty && loginForm.password.$invalid">\n			<div class="form-error" ng-message="required">Password is required</div>\n			<div class="form-error" ng-message="minlength">Your password must be at least 6 characters long</div>\n		</div>\n		<label class="item">\n			<button class="button button-block button-positive" type="submit">Log in</button>\n		</label>\n	</div>\n</form>'),n.put("templates/modal-auth-register.html",'<form name="registerForm" ng-submit="doRegister(registerForm)" novalidate>\n	<div class="list">\n		<label class="item item-input item-floating-label" ng-class="{\n			\'has-error\': signinForm.name.$invalid\n		}">\n			<span class="input-label">Name</span>\n			<input type="text" name="name" ng-model="auth.data.name" ng-minlength="3" ng-maxlength="255" required placeholder="Name">\n		</label>\n		<div class="item form-errors" ng-messages="registerForm.name.$error" role="alert" ng-show="registerForm.name.$dirty && registerForm.name.$invalid">\n			<div class="form-error" ng-message="required">Name is required</div>\n			<div class="form-error" ng-message="minlength, maxlength">Your name must be between 3 and 255 characters long</div>\n		</div>\n		<label class="item item-input item-floating-label" ng-class="{\n			\'has-error\': signinForm.username.$invalid\n		}">\n			<span class="input-label">Email</span>\n			<input type="text" name="username" ng-model="auth.data.username" ng-minlength="6" ng-maxlength="255" required placeholder="Email">\n		</label>\n		<div class="item form-errors" ng-messages="registerForm.username.$error" role="alert" ng-show="registerForm.username.$dirty && registerForm.username.$invalid">\n			<div class="form-error" ng-message="required">Email is required</div>\n			<div class="form-error" ng-message="minlength, maxlength">Your email must be between 6 and 255 characters long</div>\n		</div>\n		<label class="item item-input item-floating-label" ng-class="{\n			\'has-error\': signinForm.password.$invalid\n		}">\n			<span class="input-label">Password</span>\n			<input type="password" name="password" ng-model="auth.data.password" ng-minlength="6" required placeholder="Password">\n		</label>\n		<div class="item form-errors" ng-messages="registerForm.password.$error" role="alert" ng-show="registerForm.password.$dirty && registerForm.password.$invalid">\n			<div class="form-error" ng-message="required">Password is required</div>\n			<div class="form-error" ng-message="minlength">Your password must be at least 6 characters long</div>\n		</div>\n		<label class="item item-input item-floating-label" ng-class="{\n			\'has-error\': signinForm.password2.$invalid\n		}">\n			<span class="input-label">Confirm password</span>\n			<input type="password" name="password2" ng-model="auth.data.password2" ng-minlength="6" match="registerForm.password" required placeholder="Confirm password">\n		</label>\n		<div class="item form-errors" ng-messages="registerForm.password2.$error" role="alert" ng-show="registerForm.password2.$dirty && registerForm.password2.$invalid">\n			<div class="form-error" ng-message="required">Confirm password is required</div>\n			<div class="form-error" ng-message="match">Write the same password twice</div>\n		</div>\n		<label class="item">\n			<button class="button button-block button-positive" type="submit">Continue</button>\n		</label>\n	</div>\n</form>'),n.put("templates/modal-auth.html",'<div class="modal">\n	<ion-header-bar>\n		<h1 class="title">Auth</h1>\n		<div class="buttons">\n			<button class="button button-clear" ng-click="closeAuth()">Close</button>\n		</div>\n	</ion-header-bar>\n	<ion-content>\n		<div ng-include="\'templates/modal-auth-\'+auth.action+\'.html\'"></div>\n	</ion-content>\n	<ion-footer-bar>\n		<div class="button-bar">\n		  <button class="button button-clear" ng-click="auth.setAuthAction(\'login\')" ng-class="{\n		  	\'active\' : auth.action === \'login\'\n		  }">Log in</button>\n		  <button class="button button-clear" ng-click="auth.setAuthAction(\'register\')" ng-class="{\n		  	\'active\' : auth.action === \'register\'\n		  }">Register</button>\n		</div>\n	</ion-footer-bar>\n</div>\n</div>'),n.put("templates/tab-about.html",'<ion-view view-title="About">\n  <ion-content>\n    <ion-list>\n      <ion-item class="item-text-wrap">La aplicación ha sido desarrollada de manera altruista por la comunidad de desarrolladores.</ion-item>\n      <ion-item class="item-divider">\n        Desarrolladores\n      </ion-item>\n      <ion-item class="item-avatar item-text-wrap">\n        <img src="img/davidpich.png">\n        <h2>David Pich</h2>\n        <p></p>\n      </ion-item>\n      <ion-item class="item-avatar item-text-wrap">\n        <img src="img/jorgecasar.png">\n        <h2>Jorge del Casar</h2>\n        <p>Co-founder & CTO, Geeks2Team.</p>\n      </ion-item> \n    </ion-list>\n  </ion-content>\n</ion-view>\n'),n.put("templates/tab-account.html",'<ion-view view-title="Account">\n	<ion-nav-buttons side="secondary">\n		<button class="button button-clear" ng-click="doLogout()" ng-show="user">Logout</button>\n		<button class="button button-clear" ng-click="login()" ng-hide="user">Login</button>\n	</ion-nav-buttons>\n	<ion-content>\n		<ion-list ng-show="user">\n			<ion-item ng-class="{\n				\'item-thumbnail-left\': user.img\n			}">\n				<img ng-show="user.img" ng-src="{{user.img}}">\n				<h2>{{user.name}}</h2>\n				<p>{{user.username}}</p>\n			</ion-item>\n			<ion-item class=" item-divider">\n				My happinessess\n			</ion-item>\n			<ion-item ng-repeat="happiness in happinesses track by $index" type="item-text-wrap">\n				<div class="padding-vertical text-center">\n					<i class="button button-small button-icon icon" ng-repeat="n in happinessRange" ng-class="{\n					\'ion-happy\': n <= happiness.level,\n					\'ion-happy-outline\': n > happiness.level\n					}"></i>\n				</div>\n				<h2>{{happiness.message}}</h2>\n				<p ng-if="happiness.city && happiness.city">\n					<span ng-if="happiness.city">{{happiness.city}}</span>\n					<span ng-if="happiness.city && happiness.city">, </span>\n					<span ng-if="happiness.country">{{happiness.country}}</span>\n				</p>\n				</div>\n			</ion-item>\n		</ion-list>\n	</ion-content>\n</ion-view>\n'),n.put("templates/tab-map.html","<ion-view view-title=\"Map\">\n  <ion-content>\n  	<ui-gmap-google-map center='map.center' \n  						zoom='map.zoom'\n  						control='map.control'\n  						bounds='map.bounds'\n              events='map.events'\n              pan=\"true\">\n  		<ui-gmap-markers 	models=\"markers.models\"\n  							coords=\"'self'\"\n  							icon=\"'icon'\"\n                control=\"markers.control\"\n                options=\"'options'\">\n        </ui-gmap-markers>\n  	</ui-gmap-google-map>\n  </ion-content>\n</ion-view>\n"),n.put("templates/tab-trending.html",'<ion-view view-title="Trendings">\n  <ion-nav-buttons side="secondary">\n    <button class="button button-icon icon ion-ios-plus-empty" ng-click="openAddHappiness()"></button>\n  </ion-nav-buttons>\n  <ion-content>\n    <ion-list>\n      <ion-item ng-repeat="happiness in happinesses track by $index" type="item-text-wrap">\n        <div class="padding-vertical text-center">\n          <i class="button button-small button-icon icon" ng-repeat="n in happinessRange" ng-class="{\n        \'ion-happy\': n <= happiness.level,\n        \'ion-happy-outline\': n > happiness.level\n        }"></i>\n        </div>\n        <h2>{{happiness.message}}</h2>\n        <p ng-if="happiness.city && happiness.city">\n          <span ng-if="happiness.city">{{happiness.city}}</span>\n          <span ng-if="happiness.city && happiness.city">, </span>\n          <span ng-if="happiness.country">{{happiness.country}}</span>\n        </p>\n      </ion-item>\n    </ion-list>\n  </ion-content>\n</ion-view>\n'),n.put("templates/tabs.html",'<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class="tabs-icon-top tabs-color-active-positive">\n\n  <!-- Map Tab -->\n  <ion-tab title="Map" icon-off="ion-ios-location-outline" icon-on="ion-ios-location" ui-sref="app.map">\n    <ion-nav-view name="tab-map"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Trending Tab -->\n  <ion-tab title="Trending" icon-off="ion-ios-bolt-outline" icon-on="ion-ios-bolt" ui-sref="app.trending">\n    <ion-nav-view name="tab-trending"></ion-nav-view>\n  </ion-tab>\n\n  <!-- About Tab -->\n  <ion-tab title="About" icon-off="ion-ios-information-outline" icon-on="ion-ios-information" ui-sref="app.about">\n    <ion-nav-view name="tab-about"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Account Tab -->\n  <ion-tab title="Account" icon-off="ion-ios-person-outline" icon-on="ion-ios-person" ui-sref="app.account">\n    <ion-nav-view name="tab-account"></ion-nav-view>\n  </ion-tab>\n\n\n</ion-tabs>\n')}]),angular.module("app.config",[]).constant("dpdConfig",{collections:["happinesses","users"],serverRoot:"http://hackhappiness.herokuapp.com/",socketOptions:{reconnectionDelayMax:3e3},useSocketIo:!1,noCache:!1});