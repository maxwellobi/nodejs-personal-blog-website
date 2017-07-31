
!function($) {
    "use strict";

    var SweetAlert = function() {};
    SweetAlert.prototype.init = function() {
    
        $('.delete_btn').click(function(event){
            var _id = $(this).data('blog'); 
            event.preventDefault();
            swal({   
                title: "Are you sure?",   
                text: "You are about to delete a blog post.",   
                type: "warning",   
                allowEscapeKey: false,
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Yes, delete it!",   
                closeOnConfirm: false 

            }, function(){   
                
                $.get('/blogs/' + _id + '/delete', function(data, status){
                    swal({
                        title: data.title, 
                        text: data.msg,
                        type: data.status,  
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setInterval(function(){
                        window.location.replace('/blogs/all');
                    }, 2000)
                });
            });
        });

    },
    $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
}(window.jQuery),

function($) {
    "use strict";
    $.SweetAlert.init()
}(window.jQuery);