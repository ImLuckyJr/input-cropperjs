# @imluckyjr/input-cropperjs


[![npm (scoped)](https://img.shields.io/npm/v/@imluckyjr/input-cropperjs.svg)](https://github.com/ImLuckyJr/input-cropperjs)

Using library CropperJS for inputs with drag&drop.

# Install
```npm
npm install @imluckyjr/input-cropperjs
```
Script make parent element of input droppable with class 'is-dragover' for dragging image. Also you can choose file.
# Usage

```js
//selector of input
$(selector).cropperImage([options]);
```

# Options
### input-previews
- Type `boolean`
- Default `false`

`True` says that there are preview blocks for every input with `selector`. 

_Each preview block must have ID like `photo-input-preview`, where `photo-input` is ID of input._

# Example

### HTML
```HTML
<div id="" class="">
  <div class="mt-3 js-image-preview" id="custom-file-input-preview" style="background-image: url(YOUR_URL)"></div>
  <div class="custom-file">
    <input type="file" class="js-cropper custom-file-input" id="custom-file-input">
    <label class="custom-file-label" for="custom-file-input">Choose file</label>
  </div>
</div>

```

### JS
```js
$('.js-cropper').cropperImage({
  'input-previews': true
});
```
