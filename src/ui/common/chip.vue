<template>
  <div class="chip">
    <div class="chip__image" v-if="image">
      <img :src="image" alt="">
    </div>
    <div class="chip__text">{{text}}</div>
    <div class="chip__close" @click="remove(text)">
      <svg class="jss54 jss325" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
      </svg>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    deletable: {
      default: true,
      type: Boolean,
    },
    text: String,
    image: String,
  },
})
export default class Chip extends Vue {
  remove(text) {
    this.$emit('remove', text);
  }
}
</script>

<style lang="scss">
.chip {
  display: flex;
  height: 26px;
  background-color: rgba(62, 100, 119, 0.08);
  align-items: center;
  border-radius: 16px;
  margin-right: 6px;
  margin-bottom: 6px;
}

.chip__image {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip__text {
  color: #495c69;
  font-size: 13px;
  font-weight: 500;
  padding: 0 6px;
}

.chip__close {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 120ms ease-in-out;
  svg {
    width: 100%;
    height: 100%;
    transition: all 120ms ease-in-out;
    path {
      fill: rgba(133, 155, 168, 0.53);
    }
  }

  &:hover {
    svg path {
      fill: rgba(236, 34, 31, 0.75);
    }
  }
}
</style>
