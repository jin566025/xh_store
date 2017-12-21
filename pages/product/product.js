const app = getApp()
Page({
    data: {
        isLike: true,
        // banner
        imgUrls: [
            "../../img/a.jpg"
        ],
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔,3s
        duration: 1000, //  滑动动画时长1s
        circular:true,
        // 商品详情介绍
        detailImg: [
            "../../img/a.jpg",
            "../../img/b.jpg",
            "../../img/c.jpg"
        ],
        showModalStatus: false,
        showModalStatus2: false,
        inputTxt:1,
        kucun:10000,
        price:666.00,
        goods_name:"大金刚0564",
        goods_describe:"",
        goods_id:"",
        colorshow:false,
        haszhekou:false
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
    onLoad: function (options){
        var goodId = options.goodId;
    
        this.setData({
            url_path: app.getUrl.url,
            member_id: app.getMember.member_id
        })
        wx.request({
            url: this.data.url_path + "/api/get_good_detail",
            data:{
                goods_id: goodId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res =>  {

                var goods = res.data.data;
                console.log(goods)
                var goods_describe2 = goods.goods_describe;
                goods_describe2 = goods_describe2.replace("<p>","");
                goods_describe2 = goods_describe2.replace("</p>", "");
                
                goods_describe2 = goods_describe2.replace("", "");
                goods_describe2 = goods_describe2.replace(/\&nbsp;/g, ' ');

                if (goods.discount_price){

                    this.setData({
                        haszhekou: true
                    })
                }
                this.setData({
                    goods_name: goods.goods_name,
                    goods_describe: goods_describe2,
                    price: goods.goods_price,
                    goods_id: goods.goods_id,
                    goods_images: goods.goods_images,
                    brand: goods.brand,
                    kinds:goods.kinds,
                    colour: goods.colour,
                    material: goods.material,
                    size: goods.size,
                    number:goods.number,
                    discount_price: goods.discount_price

                })
                var colour = this.data.colour.split("、");
                console.log(colour[0])
                console.log(this.data.goods_id)
                wx.request({
                    url: this.data.url_path + "/api/get_goods_images",
                    data:{
                        goods_id: this.data.goods_id,
                        colour:colour[0]
                    },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: "post",
                    success:res=>{
                       console.log(res)
                        var colorimage = res.data.data;

                        var good_images_array = colorimage.images.split(",");
                        this.setData({
                            imgUrls: good_images_array,
                            colors: colour
                        })
                    },
                    fail:function(){}
                })
            },
            fail: function () {

            }
        })
        
        
    },
    //预览图片
    previewImage: function (e) {
        var current = e.target.dataset.src;

        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: this.data.imgUrls // 需要预览的图片http链接列表  
        })
    },
    //添加到购物车
    addToCar:function(e){
        var goodId = e.currentTarget.dataset.id;
        var member_id = app.getMember.member_id;
        var num = this.data.inputTxt;
        wx.request({
            url: this.data.url_path +"/api/add_cart" ,
            data:{
                member_id: member_id,
                goods_id: goodId,
                num: num
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method:"post",
            success:res=>{               
                if (res.data.error_msg=="成功"){
                    wx.showToast({
                        title: 'OK',
                        icon: 'success',
                        duration: 1500,
                        success:res=>{
                            var that = this;
                            setTimeout(function(){
                                that.setData({
                                    showModalStatus: false,
                                    showModalStatus2: false,
                                })
                            },1500)
                            
                        }
                    });
                }
            },
            fail:function(){

            }
        })
    },

    //立即购买//立即购买//立即购买//立即购买//立即购买//立即购买
    immybuy:function(e){
        var member_id = this.data.member_id;
        var goodId = e.currentTarget.dataset.id;
        var num = this.data.inputTxt;
        var address_id = this.data.address_id;
        var goodArray =[];
        var goods = {};
        goods.good_id = goodId;
        goods.num = String(num);
        wx.request({
            url: this.data.url_path +"/api/add_cart" ,
            data:{
                member_id: member_id,
                goods_id : goodId,
                num:num
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success:res=>{
                console.log(res)
            },
            fail:function(){}
        })
        goodArray.push(goods);
        goodArray = JSON.stringify(goodArray);
        console.log(goodArray);
        wx.request({
            url: this.data.url_path +"/api/add_order",
            data:{
                member_id: member_id,
                address_id: address_id,
                goods_json: goodArray
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success:res=>{
                console.log(res)
                if (res.data.error_msg){
                    wx.showToast({
                        title: '购买成功',
                        icon: 'success',
                        duration: 1500,
                        success: res => {
                            var that = this;
                            setTimeout(function () {
                                that.setData({
                                    showModalStatus: false,
                                    showModalStatus2: false,
                                })
                            }, 1500)

                        }
                    });
                }
            },
            fail:function(){}
        })
    },
    // 收藏
    addLike() {
        this.setData({
            isLike: !this.data.isLike
        });
    },
    // 跳到购物车
    toCar() {
        wx.switchTab({
            url: '/pages/cart/cart'
        })
    },
    // 立即购买
    immeBuy() {
        wx.showToast({
            title: '购买成功',
            icon: 'success',
            duration: 2000
        });
    },
    addNum:function(){
        if (this.data.inputTxt < this.data.kucun){
            this.setData({
                inputTxt: this.data.inputTxt+1
            })
        }
    },
    reduceNum:function(){
        if (this.data.inputTxt > 1) {
            this.setData({
                inputTxt: this.data.inputTxt - 1
            })
        }
    },
    changeNum:function(e){
        console.log(e.detail.value)
        if (e.detail.value < this.data.kucun && e.detail.value>0){
            this.setData({
                inputTxt: parseInt(e.detail.value)
            })
        } else if (e.detail.value < 0 || e.detail.value==""){
            this.setData({
                inputTxt: 1
            })
        } else if (e.detail.value > this.data.kucun){
            this.setData({
                inputTxt: this.data.kucun
            })
        }
        
    },
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    showModal2: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus2: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
        wx.request({
            url: this.data.url_path +"/api/get_addresses",
            data:{
                member_id: this.data.member_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success:res=>{
                
                var addressList = res.data.data;

                var default_address;
                var default_name;
                for (var i = 0; i < addressList.length;i++){
                    if (addressList[i].is_default=="1"){
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
    toChangAddress:function(){
        wx.navigateTo({
            url: '/pages/address/address',
        })
    },
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    hideModal2: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus2: false
            })
        }.bind(this), 200)
    },
    changeColor:function(){
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()

        this.setData({
            animationData: animation.export(),
            colorshow: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },

    closecolors:function(e){
        this.setData({
            colorshow: false
        })

        wx.request({
            url: this.data.url_path + "/api/get_goods_images",
            data: {
                goods_id: this.data.goods_id,
                colour:e.currentTarget.dataset.name,

            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                var colorimage = res.data.data;
                console.log(colorimage)
                var good_images_array = colorimage.images.split(",");
                this.setData({
                    imgUrls: good_images_array
                })
            },
            fail: function () { }
        })
    }
})