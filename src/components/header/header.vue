<template>
  <div id="header">
    <div class="header-wrap">
      <div class="avatar">
        <img :src="seller.avatar">
      </div>
      <div class="header-content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="support">
          <span :class="classMap[seller.supports[0].type] " class="icon"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="number">{{seller.supports.length}}个</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin" @click="showDetail">
      <span class="icon"></span>
      <span class="text">{{seller.bulletin}}</span>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>
    
    <transition name="fade">
      <!-- 商家详情 -->
      <div class="detail" v-show="isShow" >
        <div class="mask">
          <!-- 蒙板 -->
        </div>
        <div class="detail-wrap">
          <div class="title">{{seller.name}}</div>
          <!-- >五星评价组件 -->
          <div class="star">
            <star :score="seller.score" size="48" ></star>
          </div>
          <div class="info">
            <div class="info-title">
              <span class="line"></span>
              <span class="text">优惠信息</span>
              <span class="line"></span>
            </div>
            <ul class="info-list" v-if="seller.supports">
              <li v-for="(support,index) in seller.supports" :key="index">
                <span class="icon" :class="classMap[support.type]" ></span>
                <span class="description">{{support.description}}</span>
              </li>
            </ul>
          </div>
          <div class="detail-bulletin">
            <div class="bulletin-title">
              <span class="line"></span>
              <span class="text">商家公告</span>
              <span class="line"></span>
            </div>
            <p>{{seller.bulletin}}</p>
          </div>
          <div class="close">
            <span class="icon-close" @click="hideDetail"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import star from "../star/star.vue"

export default {
  components:{star},
  props: ["seller"],
  data() {
    return {
      classMap: [],
      isShow: false
    };
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  methods: {
    showDetail() {
      this.isShow = true;
    },
    hideDetail() {
      this.isShow = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../common/css/mixins.scss";
// 调用函数
// @include bgimg(imgages/brand)

#header {
  position: relative;
  overflow: hidden;
}
.header-wrap {
  background-color: rgba(7, 17, 27, 0.5);
  position: relative;
  color: #fff;
  padding: 24px 12px 18px 24px;
}
.avatar {
  display: inline-block;
  vertical-align: top;
}
.avatar img {
  width: 64px;
  height: 64px;
  border-radius: 2px;
}
.header-content {
  display: inline-block;
  margin-left: 16px;
}
.title {
  margin-top: 2px;
  margin-bottom: 8px;
}
.title .brand {
  display: inline-block;
  width: 30px;
  height: 18px;
  @include bgimg(images/brand);
  background-size: 30px 18px;
  background-repeat: no-repeat;
  vertical-align: top;
}
.title .name {
  margin-left: 6px;
  font-weight: bold;
  line-height: 18px;
}
.description {
  font-size: 12px;
  line-height: 12px;
  font-weight: 200;
  margin-bottom: 10px;
}
.support {
  line-height: 12px;
}
.support .icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  @include bgimg(images/decrease_1);
  background-size: 12px 12px;
  background-repeat: no-repeat;
  vertical-align: middle;
}
.support .decrease {
  @include bgimg(images/decrease_1);
}
.support .guarantee {
  @include bgimg(images/guarantee_1);
}
.support .discount {
  @include bgimg(images/discount_1);
}
.support .special {
  @include bgimg(images/special_1);
}
.support .invoice {
  @include bgimg(images/invoice_1);
}

.support .text {
  margin-left: 4px;
  font-size: 10px;
  font-weight: 200;
  line-height: 12px;
}
.support-count {
  position: absolute;
  right: 12px;
  bottom: 14px;
  padding: 7px 8px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 10px;
}
.support-count .icon-keyboard_arrow_right {
  display: inline-block;
  margin-left: 2px;
  vertical-align: middle;
}
.bulletin {
  padding: 0 12px;
  line-height: 28px;
  font-weight: 200;
  font-size: 10px;
  overflow: hidden;
  /* 文字超出如何显示  ellipsis 省略号  clip  */
  text-overflow: ellipsis;
  /* 文字是否换行  nowrap 不换行 wrap 换行 */
  white-space: nowrap;
  background-color: rgba(7, 17, 27, 0.6);
  color: #fff;
}
.bulletin .icon {
  display: inline-block;
  width: 22px;
  height: 12px;
  @include bgimg(images/bulletin);
  // background-image: url(images/bulletin@2x.png);
  background-repeat: no-repeat;
  background-size: 22px 12px;
  vertical-align: middle;
}
.bulletin .text {
  margin: 0 4px;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -5;
  /*
  filter 滤镜 
  blur() 高斯模糊 
  */
  filter: blur(10px);
}
.background img {
  width: 100%;
  opacity: 0.5;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.detail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  transition: all 0.5s;
  background-color: rgba(7, 17, 27, 0.8);
  // filter: blur(10px);
  color: #fff;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    filter: blur(10px);
    background-color: rgba(7, 17, 27, 0);
    // z-index: ;
  }
  .detail-wrap {
    padding: 64px 36px 32px;
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      line-height: 16px;
      margin-bottom: 16px;
    }
    .star {
      text-align: center;
    }
    .info {      
      .info-title {
        margin-top: 28px;
        margin-bottom: 24px;
        .line {
          display: inline-block;
          width: 111.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          vertical-align: middle;
        }
        .text {
          margin: 0 12px;
          font-size: 14px;
          font-weight: 700;
          line-height: 14px;
        }
      }
      .info-list {
        li {
          font-size: 12px;
          font-weight: 200;
          line-height: 12px;
          margin-left: 12px;
          margin-bottom: 12px;
          .icon { 
            display: inline-block;
            width: 16px;
            height: 16px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right: 6px;
            // &.decrease {
            //   @include bgimg( images/decrease_1)
            // }
            // &.discount {
            //   @include bgimg( images/discount_1)
            // }
            // &.guarantee {
            //   @include bgimg( images/guarantee_1)
            // }
            // &.special {
            //   @include bgimg( images/special_1)
            // }
            // &.invoice {
            //   @include bgimg( images/invoice_1)
            // }
            $classMap: decrease, discount, special, invoice, guarantee;
            $bgImgUrl: images/decrease_1, images/discount_1, images/special_1, images/invoice_1, images/guarantee_1;
            @for $i from 1 through 5 {          
              &.#{nth($classMap,$i)} {
                @include bgimg( nth($bgImgUrl,$i) )
              }
            }           
          }

        }
      }
    }
    .detail-bulletin {
      .bulletin-title {
        margin-top: 28px;
        margin-bottom: 24px;
        .line {
          display: inline-block;
          width: 111.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          vertical-align: middle;
        }
        .text {
          margin: 0 12px;
          font-size: 14px;
          font-weight: 700;
          line-height: 14px;
        }
      }
      p {
        font-size: 12px;
        font-weight: 200;
        line-height: 24px;
      }
    }
    .close {
      position: absolute;
      bottom: 32px;
      left: 50%;
      margin: -16px;
      font-size: 32px;
    }
  }
}

// @media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3) {
//   /* 解决不同像素比 的移动端设备 图片失真问题 */
//   .title .brand {
//     background-image: url(images/brand@3x.png);
//   }
// }
</style>