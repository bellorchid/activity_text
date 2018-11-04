var load = window.ltc.load('bootstrap.css', 'jquery', 'validate', 'editor');
load.then(function(){
  var context = window.ltc.getContext();
  var $content = $('#text-content-field'),
    editor,
    validate;
  _init();

  function _init() {
    editor = window.ltc.editor('text-content-field');
    validate = $('#step2-form').validate({
      rules: {
        title: {
          required: true,
          maxlength: 50,
          trim: true,
          course_title: true,
        },
        content: {
          required: true,
          trim: true,
        },
      },
    });
  
    editor.on('change', function(){
      $content.val(editor.getData());
      validate.form();
    });
  
    editor.on('blur', function(){
      $content.val(editor.getData());
      validate.form();
    });

    window.ltc.on('getValidate', function(msg){
      window.ltc.emit('returnValidate', {valid: validate.form()});
    });

    window.ltc.on('getActivity', function(msg){
      if (!validate.form()) {
        window.ltc.emit('returnActivity', { valid:false });
        return;
      }

      window.ltc.emit('returnActivity', {valid:true, data:$('#step2-form').serializeObject()});
    });

    if (context.activityId) {
      window.ltc.api({
        name: 'getActivity',
        pathParams: {
          id: context.activityId
        }
      }, function(result) {
        $('#title').val(result['title']);
        $content.val(result['content']);
        // status的四种状态unloaded, unloaded, ready, destroyed
        // 当status == ready的时候不执行
        editor.on('instanceReady', function( event ){
          editor.setData(result['content'], {
            callback: function() {
              console.log(editor.status);
            }
          });
        });
        // 当status == ready的时候执行
        if (editor.status === 'ready') {
          editor.setData(result['content'], {
            callback: function() {
              console.log(editor.status);
            }
          });
        }
      });
    }
  }
});