require.d(exports, "a", function () {
  return c;
}), require.d(exports, "b", function () {
  return u;
}), require.d(exports, "c", function () {
  return l;
});
false && $analyzer.log('n.d', require.d, 'e', exports, 'l', l);
var i = require("CcnG"),
  r = function () {
    function t(t) {
      this.rawFile = t;
      var e,
        n = (e = t) && (e.nodeName || e.prop && e.attr && e.find) ? t.value : t;
      this["_createFrom" + ("string" == typeof n ? "FakePath" : "Object")](n);
    }
    return t.prototype._createFromFakePath = function (t) {
      this.lastModifiedDate = void 0, this.size = void 0, this.type = "like/" + t.slice(t.lastIndexOf(".") + 1).toLowerCase(), this.name = t.slice(t.lastIndexOf("/") + t.lastIndexOf("\\") + 2);
    }, t.prototype._createFromObject = function (t) {
      this.size = t.size, this.type = t.type, this.name = t.name;
    }, t;
  }(),
  o = function () {
    function t(t, e, n) {
      this.url = "/", this.headers = [], this.withCredentials = !0, this.formData = [], this.isReady = !1, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !1, this.isError = !1, this.progress = 0, this.index = void 0, this.uploader = t, this.some = e, this.options = n, this.file = new r(e), this._file = e, t.options && (this.method = t.options.method || "POST", this.alias = t.options.itemAlias || "file"), this.url = t.options.url;
    }
    return t.prototype.upload = function () {
      try {
        this.uploader.uploadItem(this);
      } catch (t) {
        this.uploader._onCompleteItem(this, "", 0, {}), this.uploader._onErrorItem(this, "", 0, {});
      }
    }, t.prototype.cancel = function () {
      this.uploader.cancelItem(this);
    }, t.prototype.remove = function () {
      this.uploader.removeFromQueue(this);
    }, t.prototype.onBeforeUpload = function () {}, t.prototype.onBuildForm = function (t) {
      return {
        form: t
      };
    }, t.prototype.onProgress = function (t) {
      return {
        progress: t
      };
    }, t.prototype.onSuccess = function (t, e, n) {
      return {
        response: t,
        status: e,
        headers: n
      };
    }, t.prototype.onError = function (t, e, n) {
      return {
        response: t,
        status: e,
        headers: n
      };
    }, t.prototype.onCancel = function (t, e, n) {
      return {
        response: t,
        status: e,
        headers: n
      };
    }, t.prototype.onComplete = function (t, e, n) {
      return {
        response: t,
        status: e,
        headers: n
      };
    }, t.prototype._onBeforeUpload = function () {
      this.isReady = !0, this.isUploading = !0, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !1, this.isError = !1, this.progress = 0, this.onBeforeUpload();
    }, t.prototype._onBuildForm = function (t) {
      this.onBuildForm(t);
    }, t.prototype._onProgress = function (t) {
      this.progress = t, this.onProgress(t);
    }, t.prototype._onSuccess = function (t, e, n) {
      this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !0, this.isCancel = !1, this.isError = !1, this.progress = 100, this.index = void 0, this.onSuccess(t, e, n);
    }, t.prototype._onError = function (t, e, n) {
      this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !1, this.isCancel = !1, this.isError = !0, this.progress = 0, this.index = void 0, this.onError(t, e, n);
    }, t.prototype._onCancel = function (t, e, n) {
      this.isReady = !1, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !0, this.isError = !1, this.progress = 0, this.index = void 0, this.onCancel(t, e, n);
    }, t.prototype._onComplete = function (t, e, n) {
      this.onComplete(t, e, n), this.uploader.options.removeAfterUpload && this.remove();
    }, t.prototype._prepareToUploading = function () {
      this.index = this.index || ++this.uploader._nextIndex, this.isReady = !0;
    }, t;
  }(),
  a = function () {
    function t() {}
    return t.getMimeClass = function (t) {
      var e = "application";
      return -1 !== this.mime_psd.indexOf(t.type) ? e = "image" : t.type.match("image.*") ? e = "image" : t.type.match("video.*") ? e = "video" : t.type.match("audio.*") ? e = "audio" : "application/pdf" === t.type ? e = "pdf" : -1 !== this.mime_compress.indexOf(t.type) ? e = "compress" : -1 !== this.mime_doc.indexOf(t.type) ? e = "doc" : -1 !== this.mime_xsl.indexOf(t.type) ? e = "xls" : -1 !== this.mime_ppt.indexOf(t.type) && (e = "ppt"), "application" === e && (e = this.fileTypeDetection(t.name)), e;
    }, t.fileTypeDetection = function (t) {
      var e = {
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
        n = t.split(".");
      if (n.length < 2) return "application";
      var i = n[n.length - 1].toLowerCase();
      return void 0 === e[i] ? "application" : e[i];
    }, t.mime_doc = ["application/msword", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template", "application/vnd.ms-word.document.macroEnabled.12", "application/vnd.ms-word.template.macroEnabled.12"], t.mime_xsl = ["application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.template", "application/vnd.ms-excel.sheet.macroEnabled.12", "application/vnd.ms-excel.template.macroEnabled.12", "application/vnd.ms-excel.addin.macroEnabled.12", "application/vnd.ms-excel.sheet.binary.macroEnabled.12"], t.mime_ppt = ["application/vnd.ms-powerpoint", "application/vnd.ms-powerpoint", "application/vnd.ms-powerpoint", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.presentationml.template", "application/vnd.openxmlformats-officedocument.presentationml.slideshow", "application/vnd.ms-powerpoint.addin.macroEnabled.12", "application/vnd.ms-powerpoint.presentation.macroEnabled.12", "application/vnd.ms-powerpoint.presentation.macroEnabled.12", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"], t.mime_psd = ["image/photoshop", "image/x-photoshop", "image/psd", "application/photoshop", "application/psd", "zz-application/zz-winassoc-psd"], t.mime_compress = ["application/x-gtar", "application/x-gcompress", "application/compress", "application/x-tar", "application/x-rar-compressed", "application/octet-stream", "application/x-zip-compressed", "application/zip-compressed", "application/x-7z-compressed", "application/gzip", "application/x-bzip2"], t;
  }(),
  s = function (t) {
    var e = "function" == typeof Symbol && t[Symbol.iterator],
      n = 0;
    return e ? e.call(t) : {
      next: function () {
        return t && n >= t.length && (t = void 0), {
          value: t && t[n++],
          done: !t
        };
      }
    };
  },
  l = function () {
    function t(t) {
      this.isUploading = !1, this.queue = [], this.progress = 0, this._nextIndex = 0, this.options = {
        autoUpload: !1,
        isHTML5: !0,
        filters: [],
        removeAfterUpload: !1,
        disableMultipart: !1,
        formatDataFunction: function (t) {
          return t._file;
        },
        formatDataFunctionIsAsync: !1
      }, this.setOptions(t), this.response = new i.n();
    }
    return t.prototype.setOptions = function (t) {
      this.options = Object.assign(this.options, t), this.authToken = this.options.authToken, this.authTokenHeader = this.options.authTokenHeader || "Authorization", this.autoUpload = this.options.autoUpload, this.options.filters.unshift({
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
      for (var e = 0; e < this.queue.length; e++) this.queue[e].url = this.options.url;
    }, t.prototype.addToQueue = function (t, e, n) {
      var i,
        a,
        l = this,
        c = [];
      try {
        for (var u = s(t), p = u.next(); !p.done; p = u.next()) c.push(p.value);
      } catch (m) {
        i = {
          error: m
        };
      } finally {
        try {
          p && !p.done && (a = u.return) && a.call(u);
        } finally {
          if (i) throw i.error;
        }
      }
      var h = this._getFilters(n),
        d = this.queue.length,
        f = [];
      c.map(function (t) {
        e || (e = l.options);
        var n = new r(t);
        if (l._isValidFile(n, h, e)) {
          var i = new o(l, t, e);
          f.push(i), l.queue.push(i), l._onAfterAddingFile(i);
        } else l._onWhenAddingFileFailed(n, h[l._failFilterIndex], e);
      }), this.queue.length !== d && (this._onAfterAddingAll(f), this.progress = this._getTotalProgress()), this._render(), this.options.autoUpload && this.uploadAll();
    }, t.prototype.removeFromQueue = function (t) {
      var e = this.getIndexOfItem(t),
        n = this.queue[e];
      n.isUploading && n.cancel(), this.queue.splice(e, 1), this.progress = this._getTotalProgress();
    }, t.prototype.clearQueue = function () {
      for (; this.queue.length;) this.queue[0].remove();
      this.progress = 0;
    }, t.prototype.uploadItem = function (t) {
      var e = this.getIndexOfItem(t),
        n = this.queue[e],
        i = this.options.isHTML5 ? "_xhrTransport" : "_iframeTransport";
      n._prepareToUploading(), this.isUploading || (this.isUploading = !0, this[i](n));
    }, t.prototype.cancelItem = function (t) {
      var e = this.getIndexOfItem(t),
        n = this.queue[e];
      n && n.isUploading && (this.options.isHTML5 ? n._xhr : n._form).abort();
    }, t.prototype.uploadAll = function () {
      var t = this.getNotUploadedItems().filter(function (t) {
        return !t.isUploading;
      });
      t.length && (t.map(function (t) {
        return t._prepareToUploading();
      }), t[0].upload());
    }, t.prototype.cancelAll = function () {
      this.getNotUploadedItems().map(function (t) {
        return t.cancel();
      });
    }, t.prototype.isFile = function (t) {
      return function (t) {
        return File && t instanceof File;
      }(t);
    }, t.prototype.isFileLikeObject = function (t) {
      return t instanceof r;
    }, t.prototype.getIndexOfItem = function (t) {
      return "number" == typeof t ? t : this.queue.indexOf(t);
    }, t.prototype.getNotUploadedItems = function () {
      return this.queue.filter(function (t) {
        return !t.isUploaded;
      });
    }, t.prototype.getReadyItems = function () {
      return this.queue.filter(function (t) {
        return t.isReady && !t.isUploading;
      }).sort(function (t, e) {
        return t.index - e.index;
      });
    }, t.prototype.destroy = function () {}, t.prototype.onAfterAddingAll = function (t) {
      return {
        fileItems: t
      };
    }, t.prototype.onBuildItemForm = function (t, e) {
      return {
        fileItem: t,
        form: e
      };
    }, t.prototype.onAfterAddingFile = function (t) {
      return {
        fileItem: t
      };
    }, t.prototype.onWhenAddingFileFailed = function (t, e, n) {
      return {
        item: t,
        filter: e,
        options: n
      };
    }, t.prototype.onBeforeUploadItem = function (t) {
      return {
        fileItem: t
      };
    }, t.prototype.onProgressItem = function (t, e) {
      return {
        fileItem: t,
        progress: e
      };
    }, t.prototype.onProgressAll = function (t) {
      return {
        progress: t
      };
    }, t.prototype.onSuccessItem = function (t, e, n, i) {
      return {
        item: t,
        response: e,
        status: n,
        headers: i
      };
    }, t.prototype.onErrorItem = function (t, e, n, i) {
      return {
        item: t,
        response: e,
        status: n,
        headers: i
      };
    }, t.prototype.onCancelItem = function (t, e, n, i) {
      return {
        item: t,
        response: e,
        status: n,
        headers: i
      };
    }, t.prototype.onCompleteItem = function (t, e, n, i) {
      return {
        item: t,
        response: e,
        status: n,
        headers: i
      };
    }, t.prototype.onCompleteAll = function () {}, t.prototype._mimeTypeFilter = function (t) {
      return !(this.options.allowedMimeType && -1 === this.options.allowedMimeType.indexOf(t.type));
    }, t.prototype._fileSizeFilter = function (t) {
      return !(this.options.maxFileSize && t.size > this.options.maxFileSize);
    }, t.prototype._fileTypeFilter = function (t) {
      return !(this.options.allowedFileType && -1 === this.options.allowedFileType.indexOf(a.getMimeClass(t)));
    }, t.prototype._onErrorItem = function (t, e, n, i) {
      t._onError(e, n, i), this.onErrorItem(t, e, n, i);
    }, t.prototype._onCompleteItem = function (t, e, n, i) {
      t._onComplete(e, n, i), this.onCompleteItem(t, e, n, i);
      var r = this.getReadyItems()[0];
      this.isUploading = !1, r ? r.upload() : (this.onCompleteAll(), this.progress = this._getTotalProgress(), this._render());
    }, t.prototype._headersGetter = function (t) {
      return function (e) {
        return e ? t[e.toLowerCase()] || void 0 : t;
      };
    }, t.prototype._xhrTransport = function (t) {
      var e,
        n,
        i,
        r,
        o,
        a = this,
        l = this,
        c = t._xhr = new XMLHttpRequest();
      if (this._onBeforeUploadItem(t), "number" != typeof t._file.size) throw new TypeError("The file specified is no longer valid");
      if (this.options.disableMultipart) o = this.options.formatDataFunction(t);else {
        o = new FormData(), this._onBuildItemForm(t, o);
        var u = function () {
          return o.append(t.alias, t._file, t.file.name);
        };
        this.options.parametersBeforeFiles || u(), void 0 !== this.options.additionalParameter && Object.keys(this.options.additionalParameter).forEach(function (e) {
          var n = a.options.additionalParameter[e];
          "string" == typeof n && n.indexOf("{{file_name}}") >= 0 && (n = n.replace("{{file_name}}", t.file.name)), o.append(e, n);
        }), this.options.parametersBeforeFiles && u();
      }
      if (c.upload.onprogress = function (e) {
        var n = Math.round(e.lengthComputable ? 100 * e.loaded / e.total : 0);
        a._onProgressItem(t, n);
      }, c.onload = function () {
        var e = a._parseHeaders(c.getAllResponseHeaders()),
          n = a._transformResponse(c.response, e),
          i = a._isSuccessCode(c.status) ? "Success" : "Error";
        a["_on" + i + "Item"](t, n, c.status, e), a._onCompleteItem(t, n, c.status, e);
      }, c.onerror = function () {
        var e = a._parseHeaders(c.getAllResponseHeaders()),
          n = a._transformResponse(c.response, e);
        a._onErrorItem(t, n, c.status, e), a._onCompleteItem(t, n, c.status, e);
      }, c.onabort = function () {
        var e = a._parseHeaders(c.getAllResponseHeaders()),
          n = a._transformResponse(c.response, e);
        a._onCancelItem(t, n, c.status, e), a._onCompleteItem(t, n, c.status, e);
      }, c.open(t.method, t.url, !0), c.withCredentials = t.withCredentials, this.options.headers) try {
        for (var p = s(this.options.headers), h = p.next(); !h.done; h = p.next()) c.setRequestHeader((m = h.value).name, m.value);
      } catch (g) {
        e = {
          error: g
        };
      } finally {
        try {
          h && !h.done && (n = p.return) && n.call(p);
        } finally {
          if (e) throw e.error;
        }
      }
      if (t.headers.length) try {
        for (var d = s(t.headers), f = d.next(); !f.done; f = d.next()) {
          var m;
          c.setRequestHeader((m = f.value).name, m.value);
        }
      } catch (b) {
        i = {
          error: b
        };
      } finally {
        try {
          f && !f.done && (r = d.return) && r.call(d);
        } finally {
          if (i) throw i.error;
        }
      }
      this.authToken && c.setRequestHeader(this.authTokenHeader, this.authToken), c.onreadystatechange = function () {
        c.readyState == XMLHttpRequest.DONE && l.response.emit(c.responseText);
      }, this.options.formatDataFunctionIsAsync ? o.then(function (t) {
        return c.send(JSON.stringify(t));
      }) : c.send(o), this._render();
    }, t.prototype._getTotalProgress = function (t) {
      if (void 0 === t && (t = 0), this.options.removeAfterUpload) return t;
      var e = this.getNotUploadedItems().length,
        n = 100 / this.queue.length;
      return Math.round((e ? this.queue.length - e : this.queue.length) * n + t * n / 100);
    }, t.prototype._getFilters = function (t) {
      if (!t) return this.options.filters;
      if (Array.isArray(t)) return t;
      if ("string" == typeof t) {
        var e = t.match(/[^\s,]+/g);
        return this.options.filters.filter(function (t) {
          return -1 !== e.indexOf(t.name);
        });
      }
      return this.options.filters;
    }, t.prototype._render = function () {}, t.prototype._queueLimitFilter = function () {
      return void 0 === this.options.queueLimit || this.queue.length < this.options.queueLimit;
    }, t.prototype._isValidFile = function (t, e, n) {
      var i = this;
      return this._failFilterIndex = -1, !e.length || e.every(function (e) {
        return i._failFilterIndex++, e.fn.call(i, t, n);
      });
    }, t.prototype._isSuccessCode = function (t) {
      return t >= 200 && t < 300 || 304 === t;
    }, t.prototype._transformResponse = function (t, e) {
      return t;
    }, t.prototype._parseHeaders = function (t) {
      var e,
        n,
        i,
        r = {};
      return t ? (t.split("\n").map(function (t) {
        i = t.indexOf(":"), e = t.slice(0, i).trim().toLowerCase(), n = t.slice(i + 1).trim(), e && (r[e] = r[e] ? r[e] + ", " + n : n);
      }), r) : r;
    }, t.prototype._onWhenAddingFileFailed = function (t, e, n) {
      this.onWhenAddingFileFailed(t, e, n);
    }, t.prototype._onAfterAddingFile = function (t) {
      this.onAfterAddingFile(t);
    }, t.prototype._onAfterAddingAll = function (t) {
      this.onAfterAddingAll(t);
    }, t.prototype._onBeforeUploadItem = function (t) {
      t._onBeforeUpload(), this.onBeforeUploadItem(t);
    }, t.prototype._onBuildItemForm = function (t, e) {
      t._onBuildForm(e), this.onBuildItemForm(t, e);
    }, t.prototype._onProgressItem = function (t, e) {
      var n = this._getTotalProgress(e);
      this.progress = n, t._onProgress(e), this.onProgressItem(t, e), this.onProgressAll(n), this._render();
    }, t.prototype._onSuccessItem = function (t, e, n, i) {
      t._onSuccess(e, n, i), this.onSuccessItem(t, e, n, i);
    }, t.prototype._onCancelItem = function (t, e, n, i) {
      t._onCancel(e, n, i), this.onCancelItem(t, e, n, i);
    }, false && $analyzer.log('ct', t), t;
  }(),
  c = function () {
    function t(t) {
      this.onFileSelected = new i.n(), this.element = t;
    }
    return t.prototype.getOptions = function () {
      return this.uploader.options;
    }, t.prototype.getFilters = function () {
      return {};
    }, t.prototype.isEmptyAfterSelection = function () {
      return !!this.element.nativeElement.attributes.multiple;
    }, t.prototype.onChange = function () {
      var t = this.element.nativeElement.files,
        e = this.getOptions(),
        n = this.getFilters();
      this.uploader.addToQueue(t, e, n), this.onFileSelected.emit(t), this.isEmptyAfterSelection() && (this.element.nativeElement.value = "");
    }, t;
  }(),
  u = function () {
    return function () {};
  }();
false && $analyzer.log('eeee', exports, l);