# cddv vue.js 表单验证插件使用说明

# 修改使用rollup打包，并且使用umd标准。

版本：1.0.9-2

## 获取
**github**:[这里](https://github.com/cddsgtc/cddv)

**npm安装**
```
npm i vue-cdd-validator --save
```
**yarn安装**
```
yarn add vue-cdd-validator
```

## 安装
1. 浏览器标签
```
<script src="xxx/vue.js"></script>
<!--vue必须在前-->
<script src="cddv/cddv.min.js"></script>
```
2. npm
```
import Cddv from cddv;
let cddv = new Cddv()
Vue.use(cddv);
```

## 简要使用说明

**因为现在很多浏览器对html5表单的支持方式存在很大的差异，建议`type`使用`text`**

**因为现在很多浏览器对html5表单的支持方式存在很大的差异，建议`type`使用`text`**

**因为现在很多浏览器对html5表单的支持方式存在很大的差异，建议`type`使用`text`**

该插件主要使用指令的形式
能够实现我们平常的绝大部分使用

* 主要功能

1. 对每个表单使用同一个指令，加上不同的参数便可进行验证，而且也可以自定义验证方法
2. 使用一个指令加上指定参数来显示出目标表单验证的结果
3. 提交方法上的指令，用来监视如果所有的验证完成，那么则允许提交，否则不允许

## 表单指令——`v-cddv-input:arg={id:<String>,format:<String:[vue.$data|regex]>,title:<String>}`
* `arg`是指令参数，填写的是需要验证的项
    - 常用的有
        1. `nonvoid` 不可为空/必填
        2. `reg` 正则
        3. `equal` 需要等与某个项
        4. `unequal` 不能等于某项
* `id[string]` 是当前表单控件的识别id不可重复
* `format` 自定义验证的值，为字符串格式，可以使当前组件的data中的变量，也可以直接是个正则字面量，当然也有很多预设
    - `nonvoid` 指令参数是该值的话format需要填写true，
    - `reg` 需要填写内定的或者自定义的正则法则
        - 自定义的正则可以是字符串的，也可以是简写方式，简写方式需要用变量带入，因为元素属性只支持字符串形式的值，变量的话需要时组件data的变量。
        - 内置的常用的正则有
            + `'ImgCode'`
            + `'SmsCode'`
            + `'MailCode'`
            + `'UserName'`用户名4到16位的字母或数字
            + `'Pasword'`6到16位的可包含字母和!@#$%^&*.的组合
            + `'Mobile'`电话号码
            + `'RealName'`真实名字2到10位的汉字
            + `'BankNum'`银行卡号
            + `'Money'`钱
            + `'Answer'`
            + `'Mail'`邮箱
        - 当写的`format`值不是这些时将安做自定义正则进行匹配
    - `equal` 要求等于某个值，此时的format可以填写组件的data,当这些都没有匹配到时，当作自定义的值来使用。(如果重复则会出现问题)
    - `unequal` 类似于equal但是时不应该等于某个值,在该指令的值中应给出`aim`属性
* `title`，可以给当前的表单起一个自定义的名字，报错时识别信息使用
* `aim` ，一般不使用，但是在使用`equal`或者`unequal`时为了防止错误，可以使用aim来额外当作`format`使用，优先级高于`format`。可以是自定义的值，组件的`data`某个值，或者某个表单的id。


### 示例
```
<div>
<label>电话</label>
<input type='password' v-cddv-input:reg="{id:'tell',format:'Mobile',title:'电话'}" type=text ../>
</div>
<div v-cddv-msg:tell></div>

```
## 错误信息指示指令——`v-cddv-msg:id<String>`
* `id`对应的表单控件的验证结果。
* 该条指令是显示指定表单的验证结果，如果错误则进行提醒，如果正确则不现实
* 该条指令可以添加到大多数的元素上，可以进行任意的样式，不会影响效果

### 示例
```
<div class="inputs">
<label>账户</label>
  <input type="text" v-cddv-input:nonvoid="{id:'account',format:true,title:'账户'}">
  <label>密码</label>
  <input type="text" v-cddv-input:reg="{id:'psd',format:'\\^[\w|\d]{6,16}$\\',title:'密码'}">
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

### 提交按钮指令——`v-cddv-final-check:method=[method|{keys:['id1'...]}]`

* method为当前组件制定提交的方法，免去了再次使用onclick，可以把这个放在前面做指令参数，也可以放在后面做指令的值。
* 如果method放在前面，那么后面可以有一个属性为keys的对象，该属性的值是那些需要考虑验证的空间的id。如果为空值则默认把所有带有验证id的空间作为需要验证对象。

**该指令默认情况下是以一个组件实例的范围为边界的，嵌套的话，父组件就会包含子组件，此时就会存在错误，所以建议不要嵌套使用**

* 使用方法
    1. 验证不通过始在该元素上添加一个`submit-check-fialed`类，我们需要对该类进行设置,并且把点击事件清零
    2. 验证通过时，则在点击是执行vue组件自己的指定的method方法。
    3. 使用时可以添加给制定方法
    

### 示例一
```
<a classs='btn' v-cddv-final-check:method="{keys:['id1','id2',...]}">提交</a>
```
### 示例二
```
<a classs='btn' v-cddv-final-check="mehtod">提交</a>
```

## 自定义验证失败时的类名

有两个元素会在验证失败时添加类名
* `v-cdd-input`，在有这个指令的表单元素在验证失败时会添加`input-check-failed`类名
* `cddv-final-check`，在有这个指令的元素在验证失败时会添加`submit-check-failed`类名(这个一般是提交按钮)
当然用户也可以自定义类名

### 方法

#### 一
该插件的默认类名是V
所以使用new来建立一个实例，然后在构造函数中加入
```
var cddv = new V({
    inputCheckClass:xxx,
    finalCheckClass:xxx
})
Vue.use(cddv)
```
#### 二

使用实例方法`config`,该方法传入一个跟构造函数一样的对象
```
var cddv = new V()
cddv.config({
    inputCheckClass:xxx,
    finalCheckClass:xxx
})
Vue.use(cddv)
```

