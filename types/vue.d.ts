import Vue from 'vue';
import { Store } from 'store';

declare module 'vue/types/vue' {
  interface Vue {
    $store: Store<any>;
  }
}
