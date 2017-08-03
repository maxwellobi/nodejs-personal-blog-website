$(document).ready(function(){
  $('#blogfile').on('change', function(){
    
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');

    var files = $(this).get(0).files;
    var file = files[0];
    if(!file){
      return false;
    }

    var formData = new FormData();
    formData.append('blogfile', file, file.name);

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          if(data !== 'failed'){
            $('.progress-bar').width('100%');
            $('.progress-bar').html('100% - File Uploaded Successfully');
            $('#header_image').val(data);
            swal({
                title: 'Image Upload Successful',
                text: data,
                type: 'success',
                closeOnConfirm: false
              },
              function(){
                $('#file-modal').modal('hide');
                swal.close();
              }
            );
            
          }else alert('Failed ' + data);
      },
      error: function(){
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
      },
      xhr: function() {
        
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {

            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            $('.progress-bar').text((percentComplete - 5) + '%');
            $('.progress-bar').width((percentComplete - 5) + '%');

            if (percentComplete === 100) $('.progress-bar').html(' Finishing Upload');

          }

        }, false);

        return xhr;
      }
    });

  })
});
