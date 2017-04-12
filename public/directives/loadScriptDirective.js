(function () {
    angular
        .module("spartanDirective", [])
        .directive('loadScript', function() {
            return {
                restrict: 'E',
                scope: false,
                link: function(scope, elem, attr)
                {
                    if (attr.type==='text/javascript-lazy')
                    {
                        var s = document.createElement("script");
                        s.type = "text/javascript";
                        var src = elem.attr('src');
                        if(src!==undefined)
                        {
                            s.src = src;
                        }
                        else
                        {
                            var code = elem.text();
                            s.text = code;
                        }
                        document.head.appendChild(s);
                        elem.remove();
                    }
                }
            };
        })
        .directive('showtab',
            function () {
                return {
                    link: function (scope, element, attrs) {
                        element.click(function(e) {
                            e.preventDefault();
                            $(element).tab('show');
                        });
                    }
                };
            })

        .directive("pagination",function(){
            return{
                templateUrl:"templates/training/templates/training-list.view.client.html",
                link:function(scope,elem,attrs){
                    console.log(scope);
                }
            }
        });
})();