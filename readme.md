# cddv vue.js 表单验证插件使用说明

## 一、安装
```
import cddv from cddv;
Vue.use(cddv);
```

## 简要使用说明

该插件主要使用指令的形式
能够实现我们平常的绝大部分使用

* 主要功能

1. 对每个表单使用同一个指令，加上不同的参数便可进行验证，而且也可以自定义验证方法
2. 使用一个指令加上指定参数来显示出目标表单验证的结果
3. 提交方法上的指令，用来监视如果所有的验证完成，那么则允许提交，否则不允许

## 表单指令——`v-cddv-input:arg={id:,format:,,title:,}`
* id是每个表单独有的，用来识别表单，在进行信息反馈时也需要做为反馈的指令参数

### 示例
```
<div>
<input v-cddv-input:type="{id:'email',format:'Mail',title:'邮箱'}" type=text ../>
</div>
<div v-cddv-msg:email></div>

```
## 错误信息指示指令——`v-cddv-msg:id`
* 该条指令是显示指定表单的验证结果，如果错误则进行提醒，如果正确则不现实
* 该条指令可以添加到大多数的元素上，可以进行任意的样式，不会影响效果

### 示例
```
<div class="inputs">
<label>账户</label>
  <input type="text" v-cddv-input:nonvoid="{id:'account',format:,title:'账户'}">
  <label>密码</label>
  <input type="text" v-cddv-input:equal="{id:'psd',format:,title:'密码'}">
  <label>邮箱</label>
  <input type="text" v-cddv-input:reg="{id:'email',format:'Mail',title:'邮箱'}">
</div>
<div class="check-msg">
  <div v-cddv-msg:account></div>
  <div v-cddv-msg:psd></div>
  <div v-cddv-msg:email></div>
</div>
```
默认情况下，各个都是不显示的，当第一次输入后，开始进行验证，使用的change事件，所以会比较高性能。下面的显示错误的框也可以添加样式，出现在页面的任何指定位置。其主要是根据验证的结果进行display的值的变换。

### 提交按钮指令——`v-cddv-final-check`

**该指令默认情况下是以一个组件实例的范围为边界的，嵌套的话，父组件就会包含子组件，此时就会存在错误，所以建议不要潜逃使用**

* 另一种建议的使用方法是给该指令添加id值

* 使用方法
    1. 验证不通过始在该元素上添加一个`submit-check-fialed`类，我们需要对该类进行设置,并且把点击事件清零
    2. 验证通过时，则在点击是执行vue组件自己的指定的method方法。
    

### 示例
```
<a classs='btn' v-cddv-final-check:method="{keys:['id1','id2',...]}">提交</a>
```
