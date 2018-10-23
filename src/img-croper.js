import Cropper from 'cropperjs';

(function ($, window, document, Cropper) {
  let cropperVar = {
      cropperOptions: {
        viewMode: 0,
        autoCropArea: 1,
        zoomable: false
      },
      sizeImage: {
        width: 1200,
        height: 1200,
      }
    },
    fun = {}, settings,
    cropperModalDOM = '<div class="modal fade" id="modalCropper" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">' + '<div class="modal-dialog modal-lg" role="document">' + '<div class="modal-content">' + '<div class="modal-footer d-flex justify-content-center">' + '<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Отмена</button>' + '<button type="button" class="btn btn-primary js-cropper__buttons-success">Обрезать</button>' + '</div>' + '<div class="modal-body">' + '<div class="img-container">' + '<img id="imageCropper" src="#" class="img-fluid">' + '</div>' + '</div>' + '<div class="modal-footer d-flex justify-content-center">' + '<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Отмена</button>' + '<button type="button" class="btn btn-primary js-cropper__buttons-success">Обрезать</button>' + '</div>' + '</div>' + '</div>' + '</div>';

  let cropperFunction = function (selector) {
    let _thisParent = $(this).parent()[0],
      image = document.getElementById('imageCropper'),
      cropperModal = $('#modalCropper'),
      cropperButtonSuccess = $('.js-cropper__buttons-success'),
      reader;

    let done = function (url, _thisIndex) {
      image.src = url;
      cropperButtonSuccess.attr("data-id", _thisIndex);
      cropperModal.modal({
        backdrop: "static"
      });
    };

    let checkFiles = (files, _thisIndex) => {
      if (files && files.length > 0) {
        let file = files[0];
        if (URL) {
          done(URL.createObjectURL(file), _thisIndex);
        } else if (FileReader) {
          reader = new FileReader();
          reader.onload = function (e) {
            done(reader.result, _thisIndex);
          };
          reader.readAsDataURL(file);
        }
      }
    };

    fun.dropFun = function (dropFiles) {
      "use strict";

      let _this = this,
        _thisIndex = $(selector).index(_this), cropper;

      checkFiles(dropFiles, _thisIndex);

      let cropFun = function (event) {
        let canvas;
        cropperModal.modal('hide');

        if (cropper) {
          canvas = cropper.getCroppedCanvas(cropperVar.sizeImage);
          if (canvas) {
            canvas.toBlob(function (blob) {
              let reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                let id = $(event.target).attr("data-id");
                let base64data = reader.result;
                $('.js-image-base64:eq(' + id + ')').val(base64data);
                if (null !== settings['image-preview']) {
                  $('.js-image-preview:eq(' + id + ')').attr('src', base64data);
                }
              }
            });
          }
        }
      };

      cropperModal.on('shown.bs.modal', function () {
        cropper = new Cropper(image, cropperVar.cropperOptions);
        cropperButtonSuccess.on('click', cropFun);
      }).on('hidden.bs.modal', function () {
        cropper.destroy();
        cropperButtonSuccess.unbind("click", cropFun);
        $(image).attr('src', '');
        $(_this).val('');
        cropperButtonSuccess.attr("data-id", '');
      });
    };

    fun.changeFun = function (cropperImageInput) {
      "use strict";

      let files = cropperImageInput.target.files,
        _this = cropperImageInput.target,
        _thisIndex = $(selector).index(_this), cropper;

      console.log(selector + '[' + _thisIndex + ']');

      checkFiles(files, _thisIndex);

      let cropFun = function (event) {
        let canvas;
        cropperModal.modal('hide');

        if (cropper) {
          canvas = cropper.getCroppedCanvas(cropperVar.sizeImage);
          if (canvas) {
            canvas.toBlob(function (blob) {
              let reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                let id = $(event.target).attr("data-id");
                let base64data = reader.result;
                $('.js-image-base64:eq(' + id + ')').val(base64data);
                if (null !== settings['image-preview']) {
                  $('.js-image-preview:eq(' + id + ')').attr('src', base64data);
                }
              }
            });
          }
        }
      };

      cropperModal.on('shown.bs.modal', function () {
        cropper = new Cropper(image, cropperVar.cropperOptions);
        cropperButtonSuccess.on('click', cropFun);
      }).on('hidden.bs.modal', function () {
        cropper.destroy();
        cropperButtonSuccess.unbind("click", cropFun);
        $(image).attr('src', '');
        $(_this).val('');
        cropperButtonSuccess.attr("data-id", '');
      });
    };

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
      _thisParent.addEventListener(event, function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    ['dragover', 'dragenter'].forEach(function (event) {
      _thisParent.addEventListener(event, function () {
        $(this).addClass('is-dragover');
      });
    });
    ['dragleave', 'dragend', 'drop'].forEach(function (event) {
      _thisParent.addEventListener(event, function () {
        $(this).removeClass('is-dragover');
      });
    });
    _thisParent.addEventListener('drop', (e) => {
      let dropFiles = e.dataTransfer.files;
      console.log(dropFiles);
      fun.dropFun.apply(this, [dropFiles]);
    });

    $(document).unbind('change').on('change', selector, fun.changeFun);
  };

  $.fn._init = $.fn.init;

  $.fn.init = function (selector, context, root) {
    return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
  };

  $.fn.getSelector = function () {
    return $(this).data('selector');
  };

  $.fn.cropperImage = function (options) {
    let selector = $(this).getSelector();
    settings = $.extend({
      'image-preview': null
    }, options);
    $('body').append(cropperModalDOM);
    return this.each(function (index) {
      $(this).after('<input type="hidden" class="js-image-base64" name="' + settings['input-name'] + '[]" id="' + settings['input-name'] + '-' + index + '">');
      cropperFunction.apply(this, [selector]);
    });
  };

})(jQuery, window, document, Cropper);

