const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datastatus: true,
        page: 1,
        pageSize: 10,
        hasMoreData: false,
        contentlist: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    onReachBottom: function () {
        
    },
    success_query: function () {
       
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