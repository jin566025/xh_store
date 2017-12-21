const app = getApp()
Page({
    data:{

    },
    onLoad:function(){
        var nickname = app.getNickName.nickName;
        var headeimg = app.getAvatar.Avatar;
        console.log(headeimg)
        this.setData({
            nickname: nickname,
            headeimg: headeimg
        })
    },
    toIndex: function () {
        wx.redirectTo({
            url: "/pages/index/index"
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
    },
    toAddress:function(){
        wx.navigateTo({
            url: "/pages/address/address"
        })
    }
    
})