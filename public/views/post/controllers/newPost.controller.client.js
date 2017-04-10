/**
 * Created by BenYin on 4/10/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("NewPostController", NewPostController);

    function NewPostController($rootScope) {
        var vm = this;

        function init() {
            vm.user = $rootScope.currentUser;
        }
        init();
    }
})();