import Vue, { VueConstructor } from "vue";
import { error } from 'misc';

let _vue: VueConstructor;
let _state: any = {};
let _plain: any = {};
let _strict: boolean = false;

let isInstalled: boolean = false;
let vms: Vue[] = [];

export default {
  vms(idx) { return vms[idx]; },
  get vm() { return vms[0]; },

  get isVueInstalled() { return !!isInstalled; },

  get isStrict() { return !!_strict; },
  set isStrict(value) { _strict = !!value; }
}

