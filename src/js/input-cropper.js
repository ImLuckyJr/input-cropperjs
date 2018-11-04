import Cropper from 'cropperjs';

(function ($, window, document, Cropper) {
  let cropperVar = {
        cropperOptions: {
          viewMode: 0,
          autoCropArea: 1,
          zoomable: false,
          checkCrossOrigin: false
        },
        sizeImage: {
          width: 1200,
          height: 1200,
        }
      },
      fun = {}, settings, cropper, objects = [],
      cropperModalDOM = '<div class="modal fade" id="modalCropper" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">' + '<div class="modal-dialog modal-lg" role="document">' + '<div class="modal-content">' + '<div class="modal-footer d-flex justify-content-center">' + '<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Отмена</button>' + '<button type="button" class="btn btn-primary js-cropper__buttons-success">Обрезать</button>' + '</div>' + '<div class="modal-body">' + '<div class="img-container">' + '<img id="imageCropper" src="#" class="img-fluid" >' + '</div>' + '</div>' + '<div class="modal-footer d-flex justify-content-center">' + '<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Отмена</button>' + '<button type="button" class="btn btn-primary js-cropper__buttons-success">Обрезать</button>' + '</div>' + '</div>' + '</div>' + '</div>';

  let cropperFunction = function (selector) {
    let _parentThisInput = $(this).parent()[0],
        elementsOfParent = Array.prototype.slice.call(_parentThisInput.children),
        image = document.getElementById('imageCropper'),
        cropperModal = $('#modalCropper'),
        cropperModalSelector = '#modalCropper',
        cropperButtonSuccess = $('.js-cropper__buttons-success'),
        cropperButtonSuccessSelector = '.js-cropper__buttons-success',
        reader;

    let done = function (url) {
      image.src = url;
      cropperModal.modal({
        backdrop: "static"
      });
    };

    let checkFiles = (files) => {
      if (files && files.length > 0) {
        let file = files[0];
        if (URL) {
          if (typeof file === 'string') {
            done(file);
          } else {
            done(URL.createObjectURL(file));
          }
        } else if (FileReader) {
          reader = new FileReader();
          reader.onload = function (e) {
            done(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    };

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
              let base64data = reader.result;
              objects[0]['hiddenInput'].val(base64data);
              if (settings['input-previews']) {
                if ('IMG' === objects[0]['preview'].prop('tagName')) {
                  objects[0]['preview'].attr('src', base64data);
                } else {
                  objects[0]['preview'].css({
                    'background-image': 'url(' + base64data + ')'
                  });
                }
              }
            }
          });
        }
      }
    };

    fun.dropFun = function (dropFiles) {
      "use strict";

      let _this = this,
          _thisId = $(_this).attr('id'),
          fields = {};

      objects = [];
      fields['thisInput'] = _thisId;
      fields['hiddenInput'] = $('#' + _thisId + '--hidden');
      fields['preview'] = $('#' + _thisId + '-preview');
      objects.push(fields);

      checkFiles(dropFiles);
    };

    fun.changeFun = function (cropperImageInput) {
      "use strict";

      let files = cropperImageInput.target.files,
          _this = cropperImageInput.target,
          _thisId = $(_this).attr('id'),
          _thisIndex = $(selector).index(_this),
          fields = {};

      objects = [];
      fields['thisInput'] = _thisId;
      fields['hiddenInput'] = $('#' + _thisId + '--hidden');
      fields['preview'] = $('#' + _thisId + '-preview');
      objects.push(fields);

      checkFiles(files);
    };

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
      _parentThisInput.addEventListener(event, function (e) {
        // preventing the unwanted behaviours
        e.preventDefault();
        e.stopPropagation();
      });
    });
    ['dragover', 'dragenter'].forEach(function (event) {
      _parentThisInput.addEventListener(event, function () {
        $(this).addClass('is-dragover');
      });
    });
    ['dragleave', 'dragend', 'drop'].forEach(function (event) {
      _parentThisInput.addEventListener(event, function () {
        $(this).removeClass('is-dragover');
      });
    });
    _parentThisInput.addEventListener('drop', (e) => {
      // let dropFiles = (e.dataTransfer.files.length) ? e.dataTransfer.files : [e.dataTransfer.getData('text/plain')];
      let dropFiles = e.dataTransfer.files;
      fun.dropFun.apply(this, [dropFiles]);
    });

    $(document).off('change', selector).on('change', selector, fun.changeFun);

    $(document).off('shown.bs.modal', cropperModalSelector)
        .on('shown.bs.modal', cropperModalSelector, function () {
          cropper = new Cropper(image, cropperVar.cropperOptions);
        }).off('hidden.bs.modal', cropperModalSelector)
        .on('hidden.bs.modal', cropperModalSelector, function () {
          let idInput = objects[0]['thisInput'];
          cropper.destroy();
          $(image).attr('src', '');
          $('#' + idInput).val('');
          cropperButtonSuccess.attr("data-id", '');
        });

    $(document).off('click', cropperButtonSuccessSelector).on('click', cropperButtonSuccessSelector, cropFun);
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
      'input-previews': false
    }, options);
    $('body').append(cropperModalDOM);
    return this.each(function (index) {
      let inputName = $(this).attr('name'),
          inputId = $(this).attr('id');
      $(this).after('<input type="hidden" class="js-image-base64" name="' + inputName + '" id="' + inputId + '--hidden">');
      $(this).attr('name', '');
      cropperFunction.apply(this, [selector]);
    });
  };

})(jQuery, window, document, Cropper);
