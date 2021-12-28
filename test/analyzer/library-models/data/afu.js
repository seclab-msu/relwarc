require.d(exports, {
  C6: () => C,
  Ob: () => V,
  bA: () => g
});
var n = require(4650),
  r = require(6895);
class u {
  constructor(G) {
    this.rawFile = G;
    let q = function s($) {
      return !(!$ || !($.nodeName || $.prop && $.attr && $.find));
    }(G) ? G.value : G;
    this["_createFrom" + ("string" == typeof q ? "FakePath" : "Object")](q);
  }
  _createFromFakePath(G) {
    this.lastModifiedDate = void 0, this.size = void 0, this.type = "like/" + G.slice(G.lastIndexOf(".") + 1).toLowerCase(), this.name = G.slice(G.lastIndexOf("/") + G.lastIndexOf("\\") + 2);
  }
  _createFromObject(G) {
    this.size = G.size, this.type = G.type, this.name = G.name;
  }
}
class c {
  constructor(G, W, q) {
    this.url = "/", this.headers = [], this.withCredentials = !0, this.formData = [], this.isReady = !1, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !1, this.isError = !1, this.progress = 0, this.index = void 0, this.uploader = G, this.some = W, this.options = q, this.file = new u(W), this._file = W, G.options && (this.method = G.options.method || "POST", this.alias = G.options.itemAlias || "file"), this.url = G.options.url;
  }
  upload() {
    try {
      this.uploader.uploadItem(this);
    } catch {
      this.uploader._onCompleteItem(this, "", 0, {}), this.uploader._onErrorItem(this, "", 0, {});
    }
  }
  cancel() {
    this.uploader.cancelItem(this);
  }
  remove() {
    this.uploader.removeFromQueue(this);
  }
  onBeforeUpload() {}
  onBuildForm(G) {
    return {
      form: G
    };
  }
  onProgress(G) {
    return {
      progress: G
    };
  }
  onSuccess(G, W, q) {
    return {
      response: G,
      status: W,
      headers: q
    };
  }
  onError(G, W, q) {
    return {
      response: G,
      status: W,
      headers: q
    };
  }
  onCancel(G, W, q) {
    return {
      response: G,
      status: W,
      headers: q
    };
  }
  onComplete(G, W, q) {
    return {
      response: G,
      status: W,
      headers: q
    };
  }
  _onBeforeUpload() {
    this.isReady = !0, this.isUploading = !0, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !1, this.isError = !1, this.progress = 0, this.onBeforeUpload();
  }
  _onBuildForm(G) {
    this.onBuildForm(G);
  }
  _onProgress(G) {
    this.progress = G, this.onProgress(G);
  }
  _onSuccess(G, W, q) {
    this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !0, this.isCancel = !1, this.isError = !1, this.progress = 100, this.index = void 0, this.onSuccess(G, W, q);
  }
  _onError(G, W, q) {
    this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !1, this.isCancel = !1, this.isError = !0, this.progress = 0, this.index = void 0, this.onError(G, W, q);
  }
  _onCancel(G, W, q) {
    this.isReady = !1, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !0, this.isError = !1, this.progress = 0, this.index = void 0, this.onCancel(G, W, q);
  }
  _onComplete(G, W, q) {
    this.onComplete(G, W, q), this.uploader.options.removeAfterUpload && this.remove();
  }
  _prepareToUploading() {
    this.index = this.index || ++this.uploader._nextIndex, this.isReady = !0;
  }
}
let f = (() => {
  class $ {
    static getMimeClass(W) {
      let q = "application";
      return -1 !== this.mime_psd.indexOf(W.type) || W.type.match("image.*") ? q = "image" : W.type.match("video.*") ? q = "video" : W.type.match("audio.*") ? q = "audio" : "application/pdf" === W.type ? q = "pdf" : -1 !== this.mime_compress.indexOf(W.type) ? q = "compress" : -1 !== this.mime_doc.indexOf(W.type) ? q = "doc" : -1 !== this.mime_xsl.indexOf(W.type) ? q = "xls" : -1 !== this.mime_ppt.indexOf(W.type) && (q = "ppt"), "application" === q && (q = this.fileTypeDetection(W.name)), q;
    }
    static fileTypeDetection(W) {
      let q = {
          jpg: "image",
          jpeg: "image",
          tif: "image",
          psd: "image",
          bmp: "image",
          png: "image",
          nef: "image",
          tiff: "image",
          cr2: "image",
          dwg: "image",
          cdr: "image",
          ai: "image",
          indd: "image",
          pin: "image",
          cdp: "image",
          skp: "image",
          stp: "image",
          "3dm": "image",
          mp3: "audio",
          wav: "audio",
          wma: "audio",
          mod: "audio",
          m4a: "audio",
          compress: "compress",
          zip: "compress",
          rar: "compress",
          "7z": "compress",
          lz: "compress",
          z01: "compress",
          bz2: "compress",
          gz: "compress",
          pdf: "pdf",
          xls: "xls",
          xlsx: "xls",
          ods: "xls",
          mp4: "video",
          avi: "video",
          wmv: "video",
          mpg: "video",
          mts: "video",
          flv: "video",
          "3gp": "video",
          vob: "video",
          m4v: "video",
          mpeg: "video",
          m2ts: "video",
          mov: "video",
          doc: "doc",
          docx: "doc",
          eps: "doc",
          txt: "doc",
          odt: "doc",
          rtf: "doc",
          ppt: "ppt",
          pptx: "ppt",
          pps: "ppt",
          ppsx: "ppt",
          odp: "ppt"
        },
        le = W.split(".");
      if (le.length < 2) return "application";
      let Te = le[le.length - 1].toLowerCase();
      return void 0 === q[Te] ? "application" : q[Te];
    }
  }
  return $.mime_doc = ["application/msword", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template", "application/vnd.ms-word.document.macroEnabled.12", "application/vnd.ms-word.template.macroEnabled.12"], $.mime_xsl = ["application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.template", "application/vnd.ms-excel.sheet.macroEnabled.12", "application/vnd.ms-excel.template.macroEnabled.12", "application/vnd.ms-excel.addin.macroEnabled.12", "application/vnd.ms-excel.sheet.binary.macroEnabled.12"], $.mime_ppt = ["application/vnd.ms-powerpoint", "application/vnd.ms-powerpoint", "application/vnd.ms-powerpoint", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.presentationml.template", "application/vnd.openxmlformats-officedocument.presentationml.slideshow", "application/vnd.ms-powerpoint.addin.macroEnabled.12", "application/vnd.ms-powerpoint.presentation.macroEnabled.12", "application/vnd.ms-powerpoint.presentation.macroEnabled.12", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"], $.mime_psd = ["image/photoshop", "image/x-photoshop", "image/psd", "application/photoshop", "application/psd", "zz-application/zz-winassoc-psd"], $.mime_compress = ["application/x-gtar", "application/x-gcompress", "application/compress", "application/x-tar", "application/x-rar-compressed", "application/octet-stream", "application/x-zip-compressed", "application/zip-compressed", "application/x-7z-compressed", "application/gzip", "application/x-bzip2"], $;
})();
class g {
  constructor(G) {
    this.isUploading = !1, this.queue = [], this.progress = 0, this._nextIndex = 0, this.options = {
      autoUpload: !1,
      isHTML5: !0,
      filters: [],
      removeAfterUpload: !1,
      disableMultipart: !1,
      formatDataFunction: W => W._file,
      formatDataFunctionIsAsync: !1
    }, this.setOptions(G), this.response = new n.vpe();
  }
  setOptions(G) {
    this.options = Object.assign(this.options, G), this.authToken = this.options.authToken, this.authTokenHeader = this.options.authTokenHeader || "Authorization", this.autoUpload = this.options.autoUpload, this.options.filters.unshift({
      name: "queueLimit",
      fn: this._queueLimitFilter
    }), this.options.maxFileSize && this.options.filters.unshift({
      name: "fileSize",
      fn: this._fileSizeFilter
    }), this.options.allowedFileType && this.options.filters.unshift({
      name: "fileType",
      fn: this._fileTypeFilter
    }), this.options.allowedMimeType && this.options.filters.unshift({
      name: "mimeType",
      fn: this._mimeTypeFilter
    });
    for (let W = 0; W < this.queue.length; W++) this.queue[W].url = this.options.url;
  }
  addToQueue(G, W, q) {
    let le = [];
    for (let se of G) le.push(se);
    let Te = this._getFilters(q),
      N = this.queue.length,
      X = [];
    le.map(se => {
      W || (W = this.options);
      let ie = new u(se);
      if (this._isValidFile(ie, Te, W)) {
        let ee = new c(this, se, W);
        X.push(ee), this.queue.push(ee), this._onAfterAddingFile(ee);
      } else this._onWhenAddingFileFailed(ie, Te[this._failFilterIndex], W);
    }), this.queue.length !== N && (this._onAfterAddingAll(X), this.progress = this._getTotalProgress()), this._render(), this.options.autoUpload && this.uploadAll();
  }
  removeFromQueue(G) {
    let W = this.getIndexOfItem(G),
      q = this.queue[W];
    q.isUploading && q.cancel(), this.queue.splice(W, 1), this.progress = this._getTotalProgress();
  }
  clearQueue() {
    for (; this.queue.length;) this.queue[0].remove();
    this.progress = 0;
  }
  uploadItem(G) {
    let W = this.getIndexOfItem(G),
      q = this.queue[W],
      le = this.options.isHTML5 ? "_xhrTransport" : "_iframeTransport";
    q._prepareToUploading(), !this.isUploading && (this.isUploading = !0, this[le](q));
  }
  cancelItem(G) {
    let W = this.getIndexOfItem(G),
      q = this.queue[W];
    q && q.isUploading && (this.options.isHTML5 ? q._xhr : q._form).abort();
  }
  uploadAll() {
    let G = this.getNotUploadedItems().filter(W => !W.isUploading);
    !G.length || (G.map(W => W._prepareToUploading()), G[0].upload());
  }
  cancelAll() {
    this.getNotUploadedItems().map(W => W.cancel());
  }
  isFile(G) {
    return function S($) {
      return File && $ instanceof File;
    }(G);
  }
  isFileLikeObject(G) {
    return G instanceof u;
  }
  getIndexOfItem(G) {
    return "number" == typeof G ? G : this.queue.indexOf(G);
  }
  getNotUploadedItems() {
    return this.queue.filter(G => !G.isUploaded);
  }
  getReadyItems() {
    return this.queue.filter(G => G.isReady && !G.isUploading).sort((G, W) => G.index - W.index);
  }
  destroy() {}
  onAfterAddingAll(G) {
    return {
      fileItems: G
    };
  }
  onBuildItemForm(G, W) {
    return {
      fileItem: G,
      form: W
    };
  }
  onAfterAddingFile(G) {
    return {
      fileItem: G
    };
  }
  onWhenAddingFileFailed(G, W, q) {
    return {
      item: G,
      filter: W,
      options: q
    };
  }
  onBeforeUploadItem(G) {
    return {
      fileItem: G
    };
  }
  onProgressItem(G, W) {
    return {
      fileItem: G,
      progress: W
    };
  }
  onProgressAll(G) {
    return {
      progress: G
    };
  }
  onSuccessItem(G, W, q, le) {
    return {
      item: G,
      response: W,
      status: q,
      headers: le
    };
  }
  onErrorItem(G, W, q, le) {
    return {
      item: G,
      response: W,
      status: q,
      headers: le
    };
  }
  onCancelItem(G, W, q, le) {
    return {
      item: G,
      response: W,
      status: q,
      headers: le
    };
  }
  onCompleteItem(G, W, q, le) {
    return {
      item: G,
      response: W,
      status: q,
      headers: le
    };
  }
  onCompleteAll() {}
  _mimeTypeFilter(G) {
    return !(this.options.allowedMimeType && -1 === this.options.allowedMimeType.indexOf(G.type));
  }
  _fileSizeFilter(G) {
    return !(this.options.maxFileSize && G.size > this.options.maxFileSize);
  }
  _fileTypeFilter(G) {
    return !(this.options.allowedFileType && -1 === this.options.allowedFileType.indexOf(f.getMimeClass(G)));
  }
  _onErrorItem(G, W, q, le) {
    G._onError(W, q, le), this.onErrorItem(G, W, q, le);
  }
  _onCompleteItem(G, W, q, le) {
    G._onComplete(W, q, le), this.onCompleteItem(G, W, q, le);
    let Te = this.getReadyItems()[0];
    this.isUploading = !1, Te ? Te.upload() : (this.onCompleteAll(), this.progress = this._getTotalProgress(), this._render());
  }
  _headersGetter(G) {
    return W => W ? G[W.toLowerCase()] || void 0 : G;
  }
  _xhrTransport(G) {
    let le,
      W = this,
      q = G._xhr = new XMLHttpRequest();
    if (this._onBeforeUploadItem(G), "number" != typeof G._file.size) throw new TypeError("The file specified is no longer valid");
    if (this.options.disableMultipart) le = this.options.formatDataFunction(G);else {
      le = new FormData(), this._onBuildItemForm(G, le);
      const Te = () => le.append(G.alias, G._file, G.file.name);
      this.options.parametersBeforeFiles || Te(), void 0 !== this.options.additionalParameter && Object.keys(this.options.additionalParameter).forEach(N => {
        let X = this.options.additionalParameter[N];
        "string" == typeof X && X.indexOf("{{file_name}}") >= 0 && (X = X.replace("{{file_name}}", G.file.name)), le.append(N, X);
      }), this.options.parametersBeforeFiles && Te();
    }
    if (q.upload.onprogress = Te => {
      let N = Math.round(Te.lengthComputable ? 100 * Te.loaded / Te.total : 0);
      this._onProgressItem(G, N);
    }, q.onload = () => {
      let Te = this._parseHeaders(q.getAllResponseHeaders()),
        N = this._transformResponse(q.response, Te);
      this["_on" + (this._isSuccessCode(q.status) ? "Success" : "Error") + "Item"](G, N, q.status, Te), this._onCompleteItem(G, N, q.status, Te);
    }, q.onerror = () => {
      let Te = this._parseHeaders(q.getAllResponseHeaders()),
        N = this._transformResponse(q.response, Te);
      this._onErrorItem(G, N, q.status, Te), this._onCompleteItem(G, N, q.status, Te);
    }, q.onabort = () => {
      let Te = this._parseHeaders(q.getAllResponseHeaders()),
        N = this._transformResponse(q.response, Te);
      this._onCancelItem(G, N, q.status, Te), this._onCompleteItem(G, N, q.status, Te);
    }, q.open(G.method, G.url, !0), q.withCredentials = G.withCredentials, this.options.headers) for (let Te of this.options.headers) q.setRequestHeader(Te.name, Te.value);
    if (G.headers.length) for (let Te of G.headers) q.setRequestHeader(Te.name, Te.value);
    this.authToken && q.setRequestHeader(this.authTokenHeader, this.authToken), q.onreadystatechange = function () {
      q.readyState == XMLHttpRequest.DONE && W.response.emit(q.responseText);
    }, this.options.formatDataFunctionIsAsync ? le.then(Te => q.send(JSON.stringify(Te))) : q.send(le), this._render();
  }
  _getTotalProgress(G = 0) {
    if (this.options.removeAfterUpload) return G;
    let W = this.getNotUploadedItems().length,
      le = 100 / this.queue.length;
    return Math.round((W ? this.queue.length - W : this.queue.length) * le + G * le / 100);
  }
  _getFilters(G) {
    if (!G) return this.options.filters;
    if (Array.isArray(G)) return G;
    if ("string" == typeof G) {
      let W = G.match(/[^\s,]+/g);
      return this.options.filters.filter(q => -1 !== W.indexOf(q.name));
    }
    return this.options.filters;
  }
  _render() {}
  _queueLimitFilter() {
    return void 0 === this.options.queueLimit || this.queue.length < this.options.queueLimit;
  }
  _isValidFile(G, W, q) {
    return this._failFilterIndex = -1, !W.length || W.every(le => (this._failFilterIndex++, le.fn.call(this, G, q)));
  }
  _isSuccessCode(G) {
    return G >= 200 && G < 300 || 304 === G;
  }
  _transformResponse(G, W) {
    return G;
  }
  _parseHeaders(G) {
    let q,
      le,
      Te,
      W = {};
    return G && G.split("\n").map(N => {
      Te = N.indexOf(":"), q = N.slice(0, Te).trim().toLowerCase(), le = N.slice(Te + 1).trim(), q && (W[q] = W[q] ? W[q] + ", " + le : le);
    }), W;
  }
  _onWhenAddingFileFailed(G, W, q) {
    this.onWhenAddingFileFailed(G, W, q);
  }
  _onAfterAddingFile(G) {
    this.onAfterAddingFile(G);
  }
  _onAfterAddingAll(G) {
    this.onAfterAddingAll(G);
  }
  _onBeforeUploadItem(G) {
    G._onBeforeUpload(), this.onBeforeUploadItem(G);
  }
  _onBuildItemForm(G, W) {
    G._onBuildForm(W), this.onBuildItemForm(G, W);
  }
  _onProgressItem(G, W) {
    let q = this._getTotalProgress(W);
    this.progress = q, G._onProgress(W), this.onProgressItem(G, W), this.onProgressAll(q), this._render();
  }
  _onSuccessItem(G, W, q, le) {
    G._onSuccess(W, q, le), this.onSuccessItem(G, W, q, le);
  }
  _onCancelItem(G, W, q, le) {
    G._onCancel(W, q, le), this.onCancelItem(G, W, q, le);
  }
}
let C = (() => {
    class $ {
      constructor(W) {
        this.onFileSelected = new n.vpe(), this.element = W;
      }
      getOptions() {
        return this.uploader.options;
      }
      getFilters() {
        return {};
      }
      isEmptyAfterSelection() {
        return !!this.element.nativeElement.attributes.multiple;
      }
      onChange() {
        let W = this.element.nativeElement.files,
          q = this.getOptions(),
          le = this.getFilters();
        this.uploader.addToQueue(W, q, le), this.onFileSelected.emit(W), this.isEmptyAfterSelection() && (this.element.nativeElement.value = "");
      }
    }
    return $.ɵfac = function (W) {
      return new (W || $)(n.Y36(n.SBq));
    }, $.ɵdir = n.lG2({
      type: $,
      selectors: [["", "ng2FileSelect", ""]],
      hostBindings: function (W, q) {
        1 & W && n.NdJ("change", function () {
          return q.onChange();
        });
      },
      inputs: {
        uploader: "uploader"
      },
      outputs: {
        onFileSelected: "onFileSelected"
      }
    }), $;
  })(),
  V = (() => {
    class $ {}
    return $.ɵfac = function (W) {
      return new (W || $)();
    }, $.ɵmod = n.oAB({
      type: $
    }), $.ɵinj = n.cJS({
      imports: [r.ez]
    }), $;
  })();