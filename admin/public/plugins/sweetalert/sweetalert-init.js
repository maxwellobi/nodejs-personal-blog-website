
!function($) {
    "use strict";

    var SweetAlert = function() {};
    SweetAlert.prototype.init = function() {
    
        $('.delete_btn').click(function(event){
            var _id = $(this).data('category'); 
            event.preventDefault();
            swal({   
                title: "Are you sure?",   
                text: "You are about to delete a category. All articles under this category will be deleted as well. This action cannot be undone",   
                type: "warning",   
                allowEscapeKey: false,
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Yes, delete it!",   
                closeOnConfirm: false 

            }, function(){   
                
                $.get('/sudo/categories/' + _id + '/delete', function(data, status){
                    swal({
                        title: data.title, 
                        text: data.msg,
                        type: data.status,  
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setInterval(function(){
                        window.location.replace('/sudo/categories');
                    }, 1000)
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