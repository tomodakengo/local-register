<template>
  <main>
    <div class="l-grid-wrapper">
      <div id="l-itemList-wrapper">
        <div class="c-wrapper-title">
          <h2>Items</h2>
          <button v-show="!isEdit" @click="toggleIsEdit">🖊️Edit</button>
          <button v-show="isEdit" @click="toggleIsEdit">❌Back</button>
        </div>
        <div class="c-wrapper-content">
          <ul class="c-itemList">
            <li v-show="isEdit" class="c-item is-add">
              <div class="c-item-name">
                <input
                  v-model="addItemName"
                  type="text"
                  placeholder="Item Name"
                />
              </div>
              <ul class="c-item-details">
                <li>
                  <span>価格</span>
                  <input
                    v-model="addItemPrice"
                    type="number"
                    placeholder="2000"
                  />
                </li>
                <li>
                  <span>在庫</span>
                  <input
                    v-model="addItemStock"
                    type="number"
                    placeholder="50"
                  />
                </li>
              </ul>
              <div class="c-item-action">
                <button @click="addItem">➕</button>
              </div>
            </li>

            <li
              v-for="(item, itemIndex) in itemList"
              v-bind:key="itemIndex"
              class="c-item"
            >
              <div class="c-item-name">{{ item.itemName }}</div>
              <ul class="c-item-details">
                <li>
                  <span>価格</span>
                  {{ item.itemPrice }}
                </li>
                <li>
                  <span>在庫</span>
                  {{ item.itemStock }}
                </li>
              </ul>
              <div class="c-item-action">
                <button v-if="item.itemStock != 0" v-show="!isEdit" @click="addCart(itemIndex)">🛒</button>
                <button v-else>Out of Stock</button>
                <button v-show="isEdit" @click="removeItem(itemIndex)">🗑️</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div id="l-subtotal-wrapper" :class="{isShow: isShow}">
        <div class="c-wrapper-title">
          <h2>Subtotal</h2>
          <button v-show="!isShow" @click="toggleIsShow">⬆️Show</button>
          <button v-show="isShow" @click="toggleIsShow">⬇️Hide</button>
        </div>
        <div class="c-wrapper-content">
          <ul class="c-cartItemList">

            <li v-for="(cartItem, cartItemIndex) in cartItemList" v-bind:key="cartItemIndex" class="c-cartItem">
              <span class="c-cartItem-name">{{cartItem.itemName}}</span>
              <span class="c-cartItem-price">{{cartItem.itemPrice}}</span>
              <button @click="removeCart(cartItemIndex, cartItem.itemKey)" class="c-cartItem-action">❌</button>
            </li>

            <li class="c-cartItem is-subtotal">
              <span class="c-cartItem-name">SubTotal</span>
              <span class="c-cartItem-price">
                  {{cartItemList.reduce((sum, i) => sum + i.itemPrice, 0)}}
              </span>
            </li>
          </ul>
          <button @click="resetCart" id="paidButton">Paid💰</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isEdit: false,
      isShow: false,
      addItemName: null,
      addItemPrice: 0,
      addItemStock: 0,
      addItems: {},
      itemList: [],
      cartItemList: [],
      addCartItem: {},
    };
  },
  created() {
    if (localStorage.getItem("items")) {
      try {
        this.itemList = JSON.parse(localStorage.getItem("items"));
      } catch (e) {
        localStorage.removeItem("items");
      }
    }
  },
  methods: {
    toggleIsEdit() {
      this.isEdit = !this.isEdit;
    },
    toggleIsShow() {
        this.isShow = !this.isShow;
    },
    addItem() {
      // when the input-form is empty, do nothing
      if (!this.addItemName || !this.addItemPrice || !this.addItemStock) {
        return;
      }
      // Add input-form value to addItems-array
      var addItems = {
        itemName: this.addItemName,
        itemPrice: this.addItemPrice,
        itemStock: this.addItemStock,
      };
      // Push addItems to items
      this.itemList.push(addItems);
      // Reset input-form
      this.addItemName = null;
      this.addItemPrice = 0;
      this.addItemStock = 0;
      // Execute saveItems method
      this.saveItems();
    },
    removeItem(removeIndex) {
      this.itemList.splice(removeIndex, 1)
      this.saveItems()
    },
    addCart(addCartIndex) {
        // Add itemList[itemIndex] to cartItemList
        var addCartItem = {
            itemKey: addCartIndex,
            itemName: this.itemList[addCartIndex].itemName,
            itemPrice: this.itemList[addCartIndex].itemPrice
        }
        this.cartItemList.push(addCartItem)
        // reduce stock
        this.reduceStock(addCartIndex)
    },
    removeCart(index, key) {
        this.cartItemList.splice(index, 1)
        this.increaceStock(key)
    },
    resetCart() {
        this.cartItemList = []
    },
    reduceStock(index) {
        this.itemList[index].itemStock -= 1
        this.saveItems()
    },
    increaceStock(index) {
        this.itemList[index].itemStock += 1
        this.saveItems()
    },
    saveItems() {
      const parsedItemList = JSON.stringify(this.itemList);
      // Set local storage
      localStorage.setItem("items", parsedItemList);
    },
  },
};
</script>

<style>
/* A Modern CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  font-family: system-ui;
}
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}
ul[role="list"],
ol[role="list"] {
  list-style: none;
}
html:focus-within {
  scroll-behavior: smooth;
}
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}
a:not([class]) {
  text-decoration-skip-ink: auto;
}
img,
picture {
  max-width: 100%;
  display: block;
}
input,
button,
textarea,
select {
  font: inherit;
}
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Design Style */
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
}

.l-grid-wrapper {
  width: 100%;
  max-width: 1000px;
  height: calc(100% - 40px);
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin: 20px;
}
#l-itemList-wrapper {
  max-height: calc(100vh - 40px);
  grid-area: 1 / 1 / 2 / 2;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
#l-subtotal-wrapper {
  max-height: calc(100vh - 40px);
  grid-area: 1 / 2 / 2 / 3;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 20px;
}

.c-wrapper-title {
  display: flex;
}
.c-wrapper-title h2 {
  color: rgb(200, 200, 200);
  font-size: 2rem;
}
.c-wrapper-title button {
  background-color: rgb(230, 230, 230);
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  border: none;
  border-radius: 10px;
  margin-left: auto;
  padding: 0 10px;
  transition: 0.3s;
}
.c-wrapper-title button:hover {
  background-color: rgb(190, 190, 190);
}

#l-subtotal-wrapper .c-wrapper-title button {
  display: none;
}

.c-wrapper-content {
  flex: 1;
  height: 100%;
}

#paidButton {
    width: 100%;
    border: none;
    border-radius: 50px;
    background-color: rgb(30, 146, 244);
    color: rgb(255, 255, 255);
    font-weight: bold;
    padding: 5px 0;
    margin-top: 10px;
}

/* ----------
Item List
---------- */
.c-itemList {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 10px;
  max-height: calc(100% - 60px);
  overflow-y: auto;
}
.c-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  padding: 0 0 0 10px;
  margin: 15px 0px;
  border-radius: 10px;
  color: rgb(120, 120, 120);
}

.c-item-name {
  grid-area: 1 / 1 / 2 / 2;
  font-size: 1.2rem;
  font-weight: bold;
}
.c-item-details {
  grid-area: 2 / 1 / 3 / 2;
  list-style: none;
  display: flex;
  padding-left: 0;
}
.c-item-details li {
  display: flex;
  align-items: center;
  margin: 0 15px 0 0;
  font-size: 0.7rem;
  font-weight: bold;
}
.c-item-details li span {
  margin-right: 5px;
}
.c-item-action {
  grid-area: 1 / 2 / 3 / 3;
  align-self: center;
}
.c-item-action button {
  border: none;
  margin: 5px 10px;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: rgb(255, 255, 255);
  color: rgb(190, 190, 190);
}

.c-item.is-add {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(240, 240, 240);
}
.c-item.is-add input {
  border: 1px solid rgb(190, 190, 190);
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  margin: 5px;
  font-weight: normal;
}
.c-item.is-add .c-item-action button {
  background-color: rgb(255, 255, 255);
}

/* ----------
Sub Total
---------- */
.c-cartItemList {
  padding: 0;
  margin: 0;
  list-style: none;
  max-height: calc(100vh - 165px);
  overflow-y: auto;
}

.c-cartItem {
  margin: 5px 0;
  padding: 5px 0;
  border-bottom: 1px solid rgb(240, 240, 240);
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: rgb(120, 120, 120);
}
.c-cartItem:last-child {
  border-bottom: none;
}

.c-cartItem-name {
  flex: 1;
}
.c-cartItem.is-subtotal .c-cartItem-name {
  font-weight: bold;
}

.c-cartItem-price {
  margin-left: auto;
  margin-right: 5px;
  font-size: 1rem;
  font-weight: bold;
}
.c-cartItem.is-subtotal .c-cartItem-price {
  margin-right: calc(5px + 1.8rem);
}

.c-cartItem-action {
  border: none;
  background-color: transparent;
}

/* ----------
Responsive
---------- */
@media screen and (max-width: 1000px) {
  .l-grid-wrapper {
    width: 100vw;
    height: calc(100% - 40px);
    grid-template-columns: 1fr;
  }
  #l-itemList-wrapper {
    width: 100vw;
    max-height: calc(100vh - 40px);
    grid-area: 1 / 1 / 2 / 2;
  }
  #l-subtotal-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    max-height: 75px;
    box-shadow: 10px 10px 20px 5px rgba(190, 190, 190, 0.5);
    border-radius: 10px 10px 0 0;
    transition: 0.2s ease-in-out;
  }
  #l-subtotal-wrapper .c-wrapper-title button {
    display: block;
  }
  #l-subtotal-wrapper.isShow {
    max-height: 90vh;
    transition: 0.5s ease-in;
  }
  /* ----------
    Item List
    ---------- */
  .c-item.is-add input {
    width: 100%;
    border: 1px solid rgb(190, 190, 190);
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
    margin: 5px;
    font-weight: normal;
    font-size: 1rem;
  }
  .c-item.is-add .c-item-details {
    flex-direction: column;
  }
  .c-item.is-add .c-item-details li {
    display: flex;
    margin: 0;
  }
  .c-item.is-add .c-item-details li span {
    width: 2rem;
  }
  .c-item.is-add .c-item-action button {
    background-color: rgb(255, 255, 255);
  }
}
</style>
