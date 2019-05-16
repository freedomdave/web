<template>
  <div class="seller" ref="seller">
    <div class="selle-wrapper">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <span class="star">
            <star :size="36" :score="seller.score"></star>
          </span>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}份</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>元
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <div class="content-wrapper">
          <div class="content">{{seller.bulletin}}</div>
        </div>
        <ul class="supports">
          <li v-for="(item,index) in seller.supports" :key="index" class="support-item">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <div class="title">商家实景</div>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(item,index) in seller.pics" :key="index" ref="picItem">
              <img :src="item" alt>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import BScroll from "better-scroll";
import star from "../star/star.vue";
import split from "../split/split.vue";
import {saveLocal,loadFromLocal} from "../../common/js/store.js";
export default {
  components: {
    star,
    split
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      favorite: (()=>{
        return loadFromLocal(this.seller.id,"favorite",false)
      })()
    };
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "收藏";
    }
  },
  watch: {
    seller() {
      this._initScroll();
      this._initPics();
    }
  },
  mounted() {
    this._initScroll();
    this._initPics();
  },
  methods: {
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, { click: true });
        } else {
          this.scroll.refresh();
        }
      });
    },
    //用于初始化“商家实景”的横向滚动效果
    _initPics() {
      //先判断是否有这个属性
      if (this.seller.pics) {
        //这里之所以要设置宽度，是因为.pic-wrapper和.pic-list的宽度一样大
        //当.pic-list的宽度大于.pic-wrapper的宽度，才能横向滚动
        let picWidth = 120; //这里是设置每张图片的宽度
        let margin = 6;
        //width是所有图片的宽度和以及margin的大小和
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        console.log(width);
        this.$refs.picList.style.width = width + "px"; //设置.pic-list的宽度的宽度
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: "vertical" //忽略竖直方向的滚动
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    },
    toggleFavorite() {
      this.favorite = !this.favorite;
      saveLocal(this.seller.id,"favorite",this.favorite);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/mixins.scss";
.seller {
  position: absolute;
  top: 176px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    position: relative;
    padding: 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .desc {
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      font-size: 0;

      .star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
      }

      .text {
        display: inline-block;
        margin-right: 12px;
        line-height: 18px;
        vertical-align: top;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }

    .remark {
      display: flex;
      padding-top: 18px;

      .block {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border: none;
        }

        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .content {
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);

          .stress {
            font-size: 24px;
          }
        }
      }
    }

    .favorite {
      position: absolute;
      width: 50px;
      right: 11px;
      top: 18px;
      text-align: center;

      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }

  .bulletin {
    padding: 18px 18px 0 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .content-wrapper {
      padding: 0 12px 16px 12px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
      }
    }

    .supports {
      .support-item {
        padding: 16px 12px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 0;

        &:last-child {
          border: none;
        }
      }

      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: top;
        margin-right: 6px;
        background-size: 16px 16px;
        background-repeat: no-repeat;

        &.decrease {
          @include bgimg("images/decrease_4");
        }

        &.discount {
          @include bgimg("images/discount_4");
        }

        &.guarantee {
          @include bgimg("images/guarantee_4");
        }

        &.invoice {
          @include bgimg("images/invoice_4");
        }

        &.special {
          @include bgimg("images/special_4");
        }
      }

      .text {
        line-height: 16px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }
    }
  }

  .pics {
    padding: 18px;

    .title {
      margin-bottom: 12px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;

      .pic-list {
        font-size: 0;
        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
          img {
            width: 100%;
            width: 100%;
          }
          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

  .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);

    .title {
      padding-bottom: 12px;
      line-height: 14px;
      font-size: 14px;
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px;

      font-size: 12px;

      &:last-child {
      }
    }
  }
}
</style>