const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        per_page: 10,
        hasMoreData: false
    },
    onReachBottom: function () {
        wx.request({
            url: this.data.url_path + "/api/get_goods",
            data: {
                type: "2",
                page: this.data.page,
                per_page: this.data.per_page
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                if (this.data.hasMoreData) {
                    var goods = this.data.goods;
                    var array = res.data.data;
                    for (var i = 0; i < array.length; i++) {
                        goods.push(array[i]);
                    }
                    this.setData({
                        goods: goods
                    })
                    if (array.length == 10) {
                        this.setData({
                            hasMoreData: true,
                            page: this.data.page + 1
                        });
                    } else {
                        this.setData({
                            hasMoreData: false
                        })
                    }
                }
            },
            fail: function () { }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            url_path: app.getUrl.url
        })
        wx.request({
            url: this.data.url_path + "/api/get_goods",
            data: {
                type: "1"
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                var goods = res.data.data;
                var array = [];
                for (var i = 0; i < goods.length; i++) {
                    array.push(goods[i])
                }
                if (array.length == this.data.per_page) {
                    this.setData({
                        page: this.data.page + 1,
                        hasMoreData: true
                    })
                }
                this.setData({
                    goods: array
                })
            },
            fail: function () { }
        })
    },
    getGoodId: function (e) {
        var goodId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/product/product?goodId=" + goodId
        })
    }

})