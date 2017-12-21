//app.js
App({
    data: {
        nickName: '',
        userInfoAvatar: ''
    },  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  

    //获取用户信息

    wx.getUserInfo({
        success:res=>{
            this.getNickName.nickName = res.userInfo.nickName;
            this.getAvatar.Avatar = res.userInfo.avatarUrl;
            console.log(res.userInfo.avatarUrl)
        }
    })
    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        this.getcode.code = code;
        wx.request({
            url: this.getUrl.url+"/api/openid_login",
            data: {
                code: code,
                nick_name: this.getNickName.nickName,
                head_portrait: this.getAvatar.Avatar
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res=>{

                this.getMember.member_id = res.data.data.member_id
            },
            fail: function () {

            }
        })
      }
    })

  },
  getcode:{
    code:null
  },
  getNickName: {
    nickName: null
  },
  getAvatar: {
      Avatar: null
  },
  getUrl:{
      url:"https://dxh.xinhaimobile.cn"
  },
  getMember:{
      member_id:""
  }
})