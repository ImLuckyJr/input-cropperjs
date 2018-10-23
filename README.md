# @imluckyjr/input-cropperjs


[![npm (scoped)](https://img.shields.io/npm/v/@imluckyjr/input-cropperjs.svg)](https://github.com/ImLuckyJr/input-cropperjs)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@imluckyjr/input-cropperjs.svg)](https://github.com/ImLuckyJr/input-cropperjs)

Using library CropperJS for inputs with drag&drop.

# Install
```
npm install @imluckyjr/input-cropperjs
```

# Usage

```js
//selector of input
$(selector).cropperImage({
  'input-name': name, //name for hidden input created by script that you could upload image(s) to server
  'image-preview': imagePreviewSelector //optional parameter for output cropped image
});
```

Script make parent element of input droppable for dragging image. Also you can choose file.

# Example

### HTML
```HTML
<div id="" class="" data-target="#photo" data-ratio="1">
  <div class="mt-3">
    <img src="your_url" class="js-image-preview">
  </div>
  <div class="custom-file">
    <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">
    <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
  </div>
</div>
```

### JS
```js
$('.js-cropper').cropperImage({
  'input-name': 'photo',
  'image-preview': '.js-image-preview'
});
```
