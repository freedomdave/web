<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item,index) in goods"
          :key="index"
          :class="{current:currentIndex === index}"
          @click="selectFood(index)"
        >
          <span class="text">
            <span v-show="item.type >= 0" :class="classMap[item.type]" class="icon"></span>
            <span class="title">{{item.name}}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="foods-list foods-list-hook">
          <h2 class="title">{{item.name}}</h2>
          <div v-for="(food,ind) in item.foods" :key="ind" class="food-item" >
            <div @click="detaile(food)">
              <div class="item-left">
                <img :src="food.icon" alt>
              </div>
              <div class="item-right">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <p class="desc">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </p>
                <p class="price">
                  <span class="now">
                    <span>￥</span>
                    {{food.price}}
                  </span>
                  <span v-show="food.oldPrice" class="old">
                    <span>￥</span>
                    {{food.oldPrice}}
                  </span>
                </p>
              </div>
            </div>
            <div class="cart-control">
              <cartControl :food="food"></cartControl>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <shopcart
      ref="shopCart"
      :minPrice="seller.minPrice"
      :deliveryPrice="seller.deliveryPrice"
      :foodList="selectFoods"
    ></shopcart>

    <food :food="foodDetaile" ref="food"></food>
  </div>
</template>

<script>
import shopcart from "../shopcart/shopcart.vue";
import food from "../food/food.vue";
import cartControl from "../cartControl/cartControl.vue";
// npm install better-scroll --save
import BScroll from "better-scroll";
import bus from "../../bus.js";

export default {
  props: ["seller"],
  components: {
    shopcart,
    cartControl,
    food
  },
  data() {
    return {
      goods: null,
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      heightScroll: [],
      scrollY: 0,
      foodDetaile: {}
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.heightScroll.length; i++) {
        let height1 = this.heightScroll[i];
        let height2 = this.heightScroll[i + 1];
        if (!height2 || (this.scrollY < height2 && this.scrollY >= height1)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      if (this.goods) {
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
      }
      return foods;
    }
  },
  created() {
    this.$axios
      .get("/api/goods")
      .then(res => {
        if (res.data.errno === 0) {
          this.goods = res.data.goods;
          this.$nextTick(() => {
            this._initScroll();
            this._calcHeight();
            console.log(this.heightScroll);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    bus.$on("cart-add", target => {
      this._drop(target);
    });
  },
  methods: {
    selectFood(index) {
      console.log(this.currentIndex);
      let foodList = this.$refs.foodsWrapper.querySelectorAll(
        ".foods-list-hook"
      );
      this.foodsScroll.scrollToElement(foodList[index], 300);
    },
    detaile(food) {      
      this.foodDetaile = food;
      this.$refs.food.show();
    },
    _drop(target) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target);
      });
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, { click: true });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.floor(pos.y));
      });
    },
    _calcHeight() {
      // 获取到所有商品分类的元素
      let foodList = this.$refs.foodsWrapper.querySelectorAll(
        ".foods-list-hook"
      );
      let height = 0;
      this.heightScroll.push(height);
      for (var i = 0; i < foodList.length; i++) {
        height += foodList[i].clientHeight;
        this.heightScroll.push(height);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/mixins.scss";

.goods {
  position: absolute;
  top: 177px;
  bottom: 48px;
  width: 100%;
  display: flex;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;
    ul {
      li {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        // 解决行内块元素之间间隙
        font-size: 0px;
        &.current {
          margin-top: -1px;
          background-color: #fff;
          font-size: 700;
          .text {
            border-bottom: none;
          }
        }
        .text {
          font-size: 12px;
          display: table-cell;
          vertical-align: middle;
          border-bottom: 1px solid rgb(7, 17, 27, 0.1);
          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            @include bgimg(images/decrease_3);
            background-size: 12px 12px;
            background-repeat: no-repeat;
            vertical-align: top;
            margin-right: 2px;
            margin-top: 1px;
            &.decrease {
              @include bgimg(images/decrease_3);
            }
            &.discount {
              @include bgimg(images/discount_3);
            }
            &.guarantee {
              @include bgimg(images/guarantee_3);
            }
            &.special {
              @include bgimg(images/special_3);
            }
            &.invoice {
              @include bgimg(images/invoice_3);
            }
          }
          .title {
            font-size: 12px;
          }
        }
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .foods-list {
      .title {
        font-size: 12px;
        padding-left: 14px;
        border-left: 2px solid #d9dde1;
        line-height: 26px;
        color: rgb(147, 153, 159);
        background-color: #f3f5f7;
      }
      .food-item {
        margin: 18px 18px 0;
        padding-bottom: 18px;
        font-size: 0;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        display: flex;
        position: relative;
        &:last-child {
          border-bottom: none;
        }
        .item-left {
          flex: 0 0 57px;
          display: inline-block;
          margin-right: 10px;
          vertical-align: top;
          img {
            width: 57px;
            height: 57px;
            border-radius: 3px;
          }
        }
        .item-right {
          position: relative;
          flex: 1;
          display: inline-block;
          font-size: 14px;
          vertical-align: top;
          .name {
            margin-top: 2px;
            font-size: 14px;
            font-weight: 700;
            line-height: 14px;
            color: rgb(7, 17, 27);
          }
          .desc {
            margin: 8px 0;
            font-size: 10px;
            line-height: 12px;
            color: rgb(147, 153, 159);
            .count {
              display: inline-block;
              margin-right: 12px;
            }
            .rating {
              display: inline-block;
            }
          }
          .price {
            line-height: 24px;
            .now {
              color: rgb(240, 20, 20);
              font-size: 14px;
              font-weight: 700;
              margin-right: 8px;
              span {
                font-size: 10px;
                font-weight: normal;
              }
            }
            .old {
              font-size: 10px;
              font-weight: 700;
              text-decoration: line-through;
              color: rgb(147, 153, 159);
              span {
                font-size: 10px;
                font-weight: normal;
              }
            }
          }
          
        }
        .cart-control {
            position: absolute;
            right: 0;
            bottom: 18px;
          }
      }
    }
  }
}
</style>