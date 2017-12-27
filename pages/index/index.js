//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    code:"12",
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    circular:true,
    interval: 3000,
    duration: 1000,
    hotgoods:[],
    allgoods:[],
    newgoods:[]
  },
  
  onLoad: function () {
    if(app.getcode.code){
      this.setData({
        code: app.getcode.code
      })
    }

    this.setData({
        url_path: app.getUrl.url
    })

    //openid自动登录
    var that = this;

    //获取轮播图
    wx.request({
        url: this.data.url_path + "/api/get_banners",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "post",
        success: function (res) {

            if (res.errMsg == "request:ok"){
                var images = res.data.data;
                console.log(res)
                var array = [];
                for(var i=0;i<images.length;i++){
                    array.push(images[i].image_url)
                }
                that.setData({
                    imgUrls: array
                })
            }
        },
        fail: function () {
            
        }
    })


    //获取新商品
    wx.request({
        url: this.data.url_path + "/api/get_goods",
        data: {
            type: "1",
            per_page: "6"
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "post",
        success: function (res) {

            var new_goods = res.data.data;
            console.log(new_goods)
            var array = [];
            for (var i = 0; i < new_goods.length; i++) {
                array.push(new_goods[i])
            }
            that.setData({
                newgoods: array
            })
        },
        fail: function () { }

    })
    //获取热销商品列表

    wx.request({
        url: this.data.url_path + "/api/get_goods",
        data:{
            type:"2",
            per_page: "6"
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "post",
        success:function(res){

            var hot_goods = res.data.data;
            
            var array=[];
            for (var i = 0; i < hot_goods.length;i++){
                array.push(hot_goods[i])
            }
            that.setData({
                hotgoods: array
            })
        },
        fail:function(){}

    })
    //获取所有商品列表

    wx.request({
        url: this.data.url_path + "/api/get_goods",
        data: {
            type: "0",
            per_page:"6"
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "post",
        success: function (res) {
            
            var all_goods = res.data.data;
            console.log(all_goods)
            var array = [];
            for (var i = 0; i < all_goods.length; i++) {
                array.push(all_goods[i])
            }
            that.setData({
                allgoods: array
            })
        },
        fail: function () { }

    })
  },

  getGoodId:function(e){
      var goodId = e.currentTarget.dataset.id;
      wx.navigateTo({
          url: "/pages/product/product?goodId=" + goodId
      })
  },

  toIndex: function () {
      wx.redirectTo({
          url:"/pages/index/index"
      })
  },
  toCart: function () {
      wx.redirectTo({
          url: "/pages/shoppingCar/shoppingCar"
      })
  },
  toAccount: function () {
      wx.redirectTo({
          url: "/pages/account/account"
      })
  }
})
