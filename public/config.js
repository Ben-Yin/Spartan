(function(){
	angular
		.module("Spartan")
		.config(Config);
		function Config($routeProvider){
			$routeProvider
                .when("/", {
                    redirectTo: '/index'
                });


		}
		
})();