var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    mixins: [globalMixin, autocompleteMixin],
    data: function () {
      return {
        load: {
          favorite: false,
          favFolder: false, // if show the favorite folder change overlay
        },
        favFolders: [],
        favorite: null,
        newFavFolderId: null,
        history: null,
      }
    },
    created: function () { },
    mounted: function () {
      var that = this
      this.loadFavorite()
      this.loadHistory()
  
      $('#favorite-modal').on('hide.bs.modal', function (e) {
        that.load.favorite = false
      })
    },
    methods: {
      loadHistory: function () {
        if (!_UID) {
          return
        }
        var that = this
        axios.get('/ajax/history-item?seriesId=' + _seriesId)
          .then(function (res) {
            console.log(res)
            var data = res.data
            if (data.result) {
              that.history = data.result
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      loadFavorite: function () {
        if (!_UID) {
          return
        }
        var that = this
        that.load.favorite = true
        axios.get('/ajax/favorite/one?seriesId=' + _seriesId)
          .then(function (res) {
            console.log(res)
            var data = res.data
            if (data.result) {
              that.favorite = data.result
            }
  
            that.load.favorite = false
          })
          .catch(function (err) {
            console.log(err)
  
            that.load.favorite = false
          })
      },
      onClickFavorite: function () {
        if (!_UID) {
          this._goLogin()
          return
        }
        var that = this
        that.load.favorite = true
        axios.get('/ajax/favorite/one?withFolders=1&seriesId=' + _seriesId)
          .then(function (res) {
            var data = res.data
            if (data.result) {
              that.favorite = data.result
              that.newFavFolderId = that.favorite.folderId
            }
  
            if (data.folders) {
              that.favFolders = data.folders
            }
            $('#favorite-modal').modal('show')
          })
          .catch(function (err) {
            console.log(err)
            that.load.favorite = false
          })
      },
      favoriteFolderOnChange: function () {
        var that = this
        this.load.favFolder = true
        axios.post('/ajax/favorite/upsert', {
          seriesId: _seriesId,
          folderId: that.newFavFolderId,
        })
          .then(function (res) {
            var data = res.data
            if (data.eno) {
              throw new Error(eno)
            }
            if (data.result) {
              that.favorite = data.result
            }
            that.load.favFolder = false
          })
          .catch(function (err) {
            console.log(err)
            // if fail, restore the newFavFolderId to favorite.folderId
            that.newFavFolderId = that.favorite ? that.favorite.folderId : null
            that.load.favFolder = false
  
          })
      },
      favoriteFolderOnDelete: function () {
        var that = this
        this.load.favFolder = true
        axios.post('/ajax/favorite/delete', {
          seriesIds: _seriesId,
        })
          .then(function (res) {
            var data = res.data
            if (data.eno) {
              throw new Error(eno)
            }
            if (data.result) {
              that.favorite = null
              that.newFavFolderId = null
            }
            that.load.favFolder = false
          })
          .catch(function (err) {
            console.log(err)
            that.load.favFolder = false
          })
      },
    }
  })