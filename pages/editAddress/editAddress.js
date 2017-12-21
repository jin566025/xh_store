const app = getApp()
Page({
    data: {
        is_default: false,
        name: "",
        mobile: "",
        address: "",
        mail: "",
        region: [],
   
        provinceArray: ['选择省份'],
        index: 0,
        province: "选择省份",
        cityArray: ["选择城市"],
        city: "选择城市",
        areaArray: ["选择地区"],
        area: "选择地区",
        error_msg: "",
        isShowToast: false,
        toastText: ""
    },
    onLoad: function (options) {
        var address_id = options.address_id;
        this.setData({
            address_id: address_id,
            url_path: app.getUrl.url,
            member_id: app.getMember.member_id
        })
        wx.request({
            url: app.getUrl.url + "/api/get_city_level",
            data: {
                city_id: "1"
            },
            method: "post",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {

                this.setData({
                    provinceArray: res.data.data
                })
            },
            fail: function () { }
        })
        wx.request({
            url: this.data.url_path+"/api/get_address_detail",
            data:{
                member_id: this.data.member_id,
                address_id: address_id
            },
            method: "post",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success:res=>{
                
                var addressDetail = res.data.data;
                console.log(addressDetail);
                this.setData({
                    name: addressDetail.name,
                    mobile: addressDetail.mobile,
                    province: addressDetail.province_name,
                    city: addressDetail.city_name,
                    area: addressDetail.area_name,
                    address: addressDetail.address,
                    zip_code: addressDetail.zip_code,
                    province_id: addressDetail.province_id,
                    city_id: addressDetail.city_id,
                    area_id: addressDetail.area_id,
                    is_default: addressDetail.is_default,
                })
            },
            fail:function(){}
        })
    },


    checkAddress: function () {
        this.setData({
            is_default: !this.data.is_default
        })
    },
    provinceChange: function (e) {

        var province = this.data.provinceArray[parseInt(e.detail.value)].area_name;
        var cityId = this.data.provinceArray[parseInt(e.detail.value)].id;

        this.setData({
            province: province,
            province_id: cityId
        });
        wx.request({
            url: app.getUrl.url + "/api/get_city_level",
            data: {
                city_id: cityId
            },
            method: "post",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {

                this.setData({
                    cityArray: res.data.data
                })
            },
            fail: function () { }
        })
    },
    cityChange: function (e) {
        var cityName = this.data.cityArray[parseInt(e.detail.value)].area_name;
        var cityId = this.data.cityArray[parseInt(e.detail.value)].id;

        this.setData({
            city: cityName,
            city_id: cityId
        })
        wx.request({
            url: app.getUrl.url + "/api/get_city_level",
            data: {
                city_id: cityId
            },
            method: "post",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {

                this.setData({
                    areaArray: res.data.data
                })
            },
            fail: function () { }
        })
    },
    areaChange: function (e) {
        var cityName = this.data.areaArray[parseInt(e.detail.value)].area_name;
        var cityId = this.data.areaArray[parseInt(e.detail.value)].id;
        this.setData({
            area: cityName,
            area_id: cityId
        })
    },

    addAddress: function () {
        var is_default;
        if (this.data.is_default) {
            is_default = "1"
        } else {
            is_default = "0"
        }
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(this.data.mobile)) {
            console.log("111")
            var that = this;
            this.setData({
                isShowToast: true,
                toastText: "请检查手机号码"
            })
            setTimeout(function () {
                that.setData({
                    isShowToast: false
                })
            }, 1500)

        } else if (this.data.province_id == undefined) {

            var that = this;
            this.setData({
                isShowToast: true,
                toastText: "请选择省份"
            })
            setTimeout(function () {
                that.setData({
                    isShowToast: false
                })
            }, 1500)
        } else if (this.data.city_id == undefined) {
            var that = this;
            this.setData({
                isShowToast: true,
                toastText: "请选择城市"
            })
            setTimeout(function () {
                that.setData({
                    isShowToast: false
                })
            }, 1500)
        } else if (this.data.area_id == undefined) {
            var that = this;
            this.setData({
                isShowToast: true,
                toastText: "请选择地区"
            })
            setTimeout(function () {
                that.setData({
                    isShowToast: false
                })
            }, 1500)
        }else{
            wx.request({
                url: this.data.url_path + "/api/manage_address",
                data: {
                    address_id: this.data.address_id,
                    member_id: this.data.member_id,
                    name: this.data.name,
                    mobile: this.data.mobile,
                    province_id: this.data.province_id,
                    city_id: this.data.city_id,
                    area_id: this.data.area_id,
                    address: this.data.address,
                    zip_code: this.data.zip_code,
                    is_default: this.data.is_default
                },
                method: "post",
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                success: res => {
                    console.log(res)
                    if (res.data.error_msg == "成功") {
                        wx.redirectTo({
                            url: '/pages/address/address',

                        })
                    } else {
                        var that = this;
                        this.setData({
                            isShowToast: true,
                            toastText: res.data.error_msg
                        })
                        setTimeout(function () {
                            that.setData({
                                isShowToast: false
                            })
                        }, 1500)
                    }
                },
                fail: function () { }
            })
        }
        

    },

    inputChangeName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    inputChangeMobile: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    inputChangeAddress: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    inputChangeMail: function (e) {
        this.setData({
            zip_code: e.detail.value
        })
    },
    cancle: function () {
        wx.navigateBack(1);
    }

})