(function(){
	angular
		.module("Spartan")
		.config(Config);
		function Config($routeProvider){
			$routeProvider
                .when("/", {
                    redirectTo: '/index'
                })
                .when("/index", {
                    templateUrl: "/index.view.client.html"
                });


		}
		
})();