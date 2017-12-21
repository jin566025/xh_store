const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datastatus: false,
        page: 1,
        pageSize: 10,
        hasMoreData: false,
        contentlist: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            url_path: app.getUrl.url,
            member_id: app.getMember.member_id
        })
        this.success_query();
    },
    onReachBottom: function () {
        wx.request({
            url: this.data.url_path + "/api/get_orders",
            data: {
                member_id: this.data.member_id,
                status: "2",
                page: this.data.page,
                per_page: this.data.pageSize
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                if (this.data.hasMoreData) {
                    if (res.data.data[0]) {
                        var dataArray = res.data.data;
                        var contentlist = this.data.contentlist;
                        for (var i = 0; i < dataArray.length; i++) {
                            contentlist.push(dataArray[i])
                        }
                        this.setData({
                            contentlist: contentlist
                        })
                        console.log(contentlist)
                        if (dataArray.length == 10) {
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
                }


            },
            fail: function () { }
        })
    },
    success_query: function () {
        wx.request({
            url: this.data.url_path + "/api/get_orders",
            data: {
                member_id: this.data.member_id,
                status: "2",
                page: this.data.page,
                per_page: this.data.pageSize
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                if (res.data.data[0]) {
                    var dataArray = res.data.data;

                    this.setData({
                        contentlist: dataArray
                    })

                    if (dataArray.length == 10) {
                        this.setData({
                            hasMoreData: true,
                            page: this.data.page + 1
                        })

                    } else {

                    }
                } else {
                    this.setData({
                        datastatus: true
                    })

                }

            },
            fail: function () { }
        })
    },
    cancleOrder: function (e) {
        var order_id = e.target.dataset.id;
        var member_id = this.data.member_id;
        wx.request({
            url: this.data.url_path + "/api/cancel_order",
            data: {
                member_id: member_id,
                order_id: order_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {

                wx.redirectTo({
                    url: '/pages/orderFukuan/orderFukuan',
                })

            },
            fail: function () {

            }
        })
    },
    tofukuan: function () {
        wx.redirectTo({
            url: '/pages/orderFukuan/orderFukuan',
        })
    },
    tofahuo: function () {
        wx.redirectTo({
            url: '/pages/orderFahuo/orderFahuo',
        })
    },
    toshouhuo: function () {
        wx.redirectTo({
            url: '/pages/orderShouhuo/orderShouhuo',
        })
    },
    topinjia: function () {
        wx.redirectTo({
            url: '/pages/orderPinjia/orderPinjia',
        })
    },
    toshouhou: function () {
        wx.redirectTo({
            url: '/pages/orderShouhou/orderShouhou',
        })
    },

})