const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      is_default:false,
      addressArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onUnload:function(){
    //wx.navigateBack();
  },
  onLoad: function (options) {
      this.setData({
          url_path: app.getUrl.url,
          member_id: app.getMember.member_id
      })
      wx.request({
          url: this.data.url_path +"/api/get_addresses",
          data:{
              member_id: this.data.member_id
          },
          method:"post",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success:res=>{
              console.log(res)
            this.setData({
                addressArray:res.data.data
            })
          },
          fail:function(){}

      })
  },
  toAddAddress:function(){
      wx.navigateTo({
          url: "/pages/addAddress/addAddress"
      })
  },
  deleteAddress:function(e){
      var address_id = e.target.dataset.id;
      wx.request({
          url: this.data.url_path +"/api/del_address",
          data:{
              member_id: this.data.member_id,
              address_id: address_id
          },
          method: "post",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success:res=>{
              
                wx.redirectTo({
                    url: '/pages/address/address',
                })
              
          },
          fail:function(){}
      })
  },
  setDefault:function(e){
      var address_id = e.target.dataset.id;
      wx.request({
          url: this.data.url_path + "/api/set_default_address",
          data:{
              member_id: this.data.member_id,
              address_id: address_id
          },
          method: "post",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success:res=>{
            console.log(res);
            wx.redirectTo({
                url: '/pages/address/address',
            })
          },
          fail:function(){}
      })
  },
  editAddress:function(e){
      var address_id = e.currentTarget.dataset.id;
      wx.navigateTo({
          url: '/pages/editAddress/editAddress?address_id=' + address_id,
      })
  }

})