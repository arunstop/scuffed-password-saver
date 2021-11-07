import Vue from 'vue'
import {longClickDirective} from 'vue-long-click'

Vue.directive('longclick', longClickDirective({delay:400,interval:0}))