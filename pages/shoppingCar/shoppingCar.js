// pages/shoppingCar/shoppingCar.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyShow:false,
    productShow:true,
    checkAll: false,
    totalPrice:0,
    carts:[],
    page:1,
    per_page:10,
    hasMoreData:false
  },
  onShow:function(){
      wx.request({
          url: this.data.url_path + "/api/get_addresses",
          data: {
              member_id: this.data.member_id
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "post",
          success: res => {
              var addressList = res.data.data;

              var default_address;
              var default_name;
              for (var i = 0; i < addressList.length; i++) {
                  if (addressList[i].is_default == "1") {
                      default_address = addressList[i].province_name + addressList[i].city_name + addressList[i].area_name + addressList[i].address + " —— " + addressList[i].name + ":" + addressList[i].mobile;

                      this.setData({
                          default_address: default_address,
                          address_id: addressList[i].id
                      })
                  }
              }
          },
          fail: function () { }
      })
  },
  onReachBottom:function(){
      wx.request({
          url: this.data.url_path + "/api/get_carts",
          data:{
              member_id: this.data.member_id,
              page: this.data.page,
              per_page: this.data.per_page
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "post",
          success:res=>{
              if (this.data.hasMoreData){
                  if (res.data.data[0]) {
                      var dataArray = res.data.data;
                      var carts = this.data.carts;
                      for (var i = 0; i < dataArray.length; i++) {
                          carts.push(dataArray[i])
                      }
                      this.setData({
                          carts: carts
                      })
                      console.log(carts);
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
          fail:function(){}
      })
  },
  onLoad:function(){
      this.setData({
        url_path:app.getUrl.url,
        member_id: app.getMember.member_id
      })
      wx.request({
          url: this.data.url_path +"/api/get_carts",
          data:{
              member_id: this.data.member_id
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "post",
          success:res => {
            
            if(res.data.data[0]){
                this.setData({
                    carts: res.data.data,    
                })
                var dataArray = res.data.data;
                if (dataArray.length==10){
                    this.setData({
                        page: this.data.page+1,
                        hasMoreData:true
                    })
                }else{

                }
            }else{
                this.setData({
                    emptyShow: true,
                    productShow: false ,
                })
            }
            
          },
          fail:function(){}
      });
      wx.request({
          url: this.data.url_path +"/api/get_addresses",
          data: {
              member_id: this.data.member_id
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "post",
          success:res=>{
              var addressList = res.data.data;

              var default_address;
              var default_name;
              for (var i = 0; i < addressList.length; i++) {
                  if (addressList[i].is_default == "1") {
                      default_address = addressList[i].province_name + addressList[i].city_name + addressList[i].area_name + addressList[i].address + " —— " + addressList[i].name + ":" + addressList[i].mobile;

                      this.setData({
                          default_address: default_address,
                          address_id: addressList[i].id
                      })
                  }
              }
          },
          fail:function(){}
      })
  },
  immybuy:function(){
      var carts = this.data.carts;
      var goods = [];
      for(var i=0;i<carts.length;i++){
          if (carts[i].checked){
              goods.push(carts[i])
          }
      }

      var goods_json = [];
      
      for (var i = 0; i < goods.length;i++){
          var goods_array = {};
          goods_array.good_id = goods[i].goods_id;
          goods_array.num = String(goods[i].cart_num);
          goods_json.push(goods_array);
          console.log(goods_array)
      }
      goods_json = JSON.stringify(goods_json);
      console.log(goods_json);
      wx.request({
          url: this.data.url_path + "/api/add_order",
          data:{
              member_id: this.data.member_id,
              address_id : this.data.address_id,
              goods_json:goods_json
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "post",
          success:res=>{

          },
          fail:function(){}
      })
  },
  showEmpty:function(){
    this.setData({
        emptyShow:true,
        productShow:false
    })
  },
  showProduct:function(){
      this.setData({
          emptyShow: false,
          productShow: true
      })
  },
  toChangAddress: function () {
      wx.navigateTo({
          url: '/pages/address/address',
      })
  },

  checkAll:function(){
    var checkAll = this.data.checkAll;
    checkAll = !checkAll;
    var carts = this.data.carts;
    for(var i=0;i<carts.length;i++){
        carts[i].checked = checkAll;
    }
    this.setData({
        checkAll: checkAll,
        carts: carts
    })
    this.getTotalPrice();
  },
  checkProduct:function(e){
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const checked = carts[index].checked;
    carts[index].checked = !checked;
    this.setData({
        carts:carts
    });
    this.getTotalPrice();
  },
  getTotalPrice:function(){
    let carts = this.data.carts;
    let total = 0;
    for(let i=0;i<carts.length;i++){
        if (carts[i].checked){
            total += parseInt(carts[i].cart_num) * parseInt(carts[i].goods_price);

        }
    }
    this.setData({
        carts: carts,
        totalPrice:total
    })
  },
  addNum:function(e){
    var index = e.currentTarget.dataset.index;
    var carts = this.data.carts;
    var cart_num = parseInt(carts[index].cart_num);
    if (cart_num < parseInt(carts[index].goods_stock)){
        cart_num = cart_num + 1;
    }else{
        cart_num = parseInt(carts[index].goods_stock)
    }

    carts[index].cart_num=cart_num;
    this.setData({
        carts: carts
    });
    this.getTotalPrice();
  },
  reduceNum:function(e){
    var index = e.currentTarget.dataset.index;
    var carts = this.data.carts;
    var cart_num = parseInt(carts[index].cart_num);
    if (cart_num < 2){
        cart_num = 1;
    }else{
        cart_num = cart_num - 1;
    }
    carts[index].cart_num = cart_num;
    this.setData({
        carts:carts
    });
    this.getTotalPrice();
  },
  changeNum:function(e){
      var index = e.currentTarget.dataset.index;
      var inputNum;
      if (e.detail.value==""){
          inputNum=1;
      }else{
          inputNum = parseInt(e.detail.value);
      }
      
      var carts = this.data.carts;
      var cart_num = parseInt(carts[index].cart_num);
      
      if (inputNum < 2){
          cart_num = 1
      } else if (inputNum > carts[index].kucun){
          cart_num = carts[index].kucun
      } else {
          cart_num = inputNum
      }
      carts[index].cart_num = cart_num;
      this.setData({
        carts:carts
      });
      this.getTotalPrice();
  },
  deleteProduct:function(e){
    var index = e.currentTarget.dataset.index;
    var cart_id = parseInt(e.currentTarget.dataset.id);
    var member_id = parseInt(this.data.member_id);
    wx.request({
        url: this.data.url_path + "/api/del_cart",
        data: {
            member_id: member_id,
            cart_id: cart_id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "post",
        success: res => {

            console.log("cart_id:" + cart_id)
            console.log("member_id:" + member_id)
            console.log(res)

            var carts = this.data.carts;
            carts.splice(index, 1);
            this.setData({
                carts: carts
            });
            if (!carts.length) {
                this.setData({
                    emptyShow: true,
                    productShow: false
                })
            } else {
                this.getTotalPrice();
            }

        },
        fail: function () { }
    })
    
    
    
    
  },
  toIndex:function(){
      wx.redirectTo({
          url: '/pages/index/index',
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
  }
})