'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var V = (function () {
    function V() {
        _classCallCheck(this, V);

        // 需要验证的表单集合
        // this._cddv = []
        this._cfg = {
            // 空白文字
            nonvoid: function nonvoid(v, bool) {
                if (bool) {
                    return v.trim() ? 0 : ['nonvoid'];
                } else {
                    return 0;
                }
            },
            // 正则
            reg: function reg(v, _reg) {
                return _reg.test(v) ? 0 : ['reg'];
            },
            // 区间
            limit: function limit(v, interval) {
                return +v >= interval[0] && +v <= interval[1] ? 0 : ['limit'];
            },
            // 等于
            equal: function equal(v, target) {
                return v == target ? 0 : ['equal'];
            },
            // 不等于
            unequal: function unequal(v, target) {
                return v != target ? 0 : ['unequal'];
            }
        };
        // 常用正则
        this._regList = {
            ImgCode: /^[0-9a-zA-Z]{4}$/,
            SmsCode: /^\d{4}$/,
            MailCode: /^\d{4}$/,
            UserName: /^[\w|\d]{4,16}$/,
            Password: /^[\w!@#$%^&*.]{6,16}$/,
            Mobile: /^1[3|5|8]\d{9}$/,
            RealName: /^[\u4e00-\u9fa5 ]{2,10}$/,
            BankNum: /^\d{10,19}$/,
            Money: /^([1-9]\d*|0)$/,
            Answer: /^\S+$/,
            Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        };
        // 错误信息提醒
        this._ERR_MSG = {
            nonvoid: '该项要求不能为空值',
            reg: '格式错误',
            limit: '您输入的值不在区间内',
            equal: '两次输入的值不相等',
            unequal: '两次输入的值重复'
        };
    }

    // get cddv() {
    //     return this._cddv
    // }
    // set cddv(value) {
    //     this._cddv = value
    // }

    _createClass(V, [{
        key: 'install',
        value: function install(Vue, options) {
            // cddv本身
            var self = this;
            // 验证上的指令
            Vue.directive('cddv-input', {
                bind: function bind(el, binding, vnode) {
                    // 用来验证结果
                    var ves = 0;
                    // 指令值
                    var v = {
                        value: binding.value || '',
                        arg: binding.arg || ''
                    };
                    // 当前实例
                    var vm = vnode.context,
                        cddv = vm._cddv;

                    // 给el添加东西
                    if (!el._cddv) {
                        el._cddv = {
                            dirty: false,
                            v_type: v.arg,
                            indeed_value: v.value.format,
                            validated: false,
                            msg: '未进行验证',
                            title: v.value.title
                        };
                    }
                    // 如果没有加入其中，则加入，把需要验证的项添加到实例的_.cddv.forms中
                    if (!cddv.forms[v.value.id]) cddv.forms[v.value.id] = el;
                    console.log(vm._cddv.forms);
                    // 给该元素添加监听事件验证
                    el.onchange = function () {
                        if (!el._cddv.dirty) el._cddv.dirty = true;
                        // console.log()
                        // console.log(self.cfg[v.arg](el.value, v.value.format))
                        ves = cddv.check(v, el, vm);
                        // 对每个元素设置
                        cddv.msg(v, el, ves);

                        console.log(el._cddv);
                        console.log(el._cddv.msg);
                        // console.log(binding)
                        // 定义自定义事件
                        vm.$emit('cddv-checked');
                    };
                }
            });
            // 输出错误信息方法
            Vue.directive('cddv-msg', {
                bind: function bind(el, binding, vnode) {
                    var v = {
                        arg: binding.arg
                    };
                    var vm = vnode.context;

                    // 把元素的样式设置成non
                    el.style.display = 'none';

                    var listener = vm._cddv.forms[v.arg];
                    // 自定义事件，监听目标值的变化
                    vm.$on('cddv-checked', function () {
                        // console.log(vm._cddv)
                        if (listener._cddv.validated) {
                            el.style.display = 'none';
                        } else if (!listener._cddv.validated && listener._cddv.dirty) {
                            el.style.display = 'block';
                            el.innerHTML = listener._cddv.msg;
                        }
                    });
                }
            });
            // 提交按钮自定认证
            Vue.directive('cddv-final-check', {
                bind: function bind(el, binding, vnode) {
                    var v = {
                        arg: binding.arg || '',
                        value: binding.value || ''
                    };
                    var vm = vnode.context;
                    // 判断指定的表单是否验证通过
                    vm.$on('cddv-checked', function () {
                        var validated = true;

                        // 如果传递了key选项择进行指定的验证
                        if (v.value.keys) {
                            validated = v.value.keys.every(function (item, index) {
                                // console.log(vm._cddv.forms[item])
                                return vm._cddv.forms[item]._cddv.validated;
                            });
                        } else {
                            console.log(vm._cddv.forms);
                            for (var item in vm._cddv.forms) {
                                if (item == 'undefined') {
                                    continue;
                                } else {

                                    if (!vm._cddv.forms[item]._cddv.validated) {
                                        validated = false;
                                        break;
                                    }
                                }
                            }
                        }
                        // 如果验证通过或者不通过的进一步处理
                        var className = el.className.split(' ');
                        if (!validated) {
                            //验证未通过
                            el.onclick = function () {};
                            if (className.indexOf('submit-check-failed') == -1) {
                                className.push('submit-check-failed');
                            }
                            el.className = className.join(' ');
                        } else {
                            //验证通过
                            className.pop();
                            el.className = className.join(' ');
                            if (v.arg) {
                                el.onclick = vm[v.arg];
                            } else el.onclick = v.value.method;
                        }

                        // 如果通过则执行
                    });
                }
            });

            // 实例方法，为每个实例添加一个对象属性
            Vue.prototype._cddv = {
                forms: {},
                check: function check(v, el, vm) {
                    if (v.arg == 'reg') {
                        if (self._regList[v.value.format]) {
                            v.value.format = self._regList[v.value.format];
                        }
                    }
                    // 如果存在aim选项则进行值的最优选择
                    var checkValue = v.value.aim || vm.$data[v.value.aim] || el.value;
                    return self.cfg[v.arg](checkValue, v.value.format);
                },
                msg: function msg(v, el, ves) {
                    // 错误信息附加信息
                    var str = '';
                    switch (ves[0]) {
                        case 'nonvoid':
                            str = '[' + v.value.title + ']';
                            el._cddv.validated = false;
                            el._cddv.msg = str + self._ERR_MSG[ves];
                            break;
                        case 'reg':
                            str = "[" + v.value.title + ']格式错误';
                            el._cddv.validated = false;
                            el._cddv.msg = str;
                            break;
                        case 'limit':
                            str = +el.value < v.value.format[0] ? '[' + v.value.title + ']应该大于' + v.value.format[0] : '[' + v.value.title + ']应该小于' + v.value.format[1];
                            el._cddv.validated = false;
                            el._cddv.msg = self._ERR_MSG[ves] + str;
                            break;
                        case 'equal':
                            str = "[" + v.value.title + ']';
                            el._cddv.validated = false;
                            el._cddv.msg = str + self._ERR_MSG[ves];
                            break;
                        case 'unequal':
                            str = '[' + v.value.title + ']';
                            el._cddv.validated = false;
                            el._cddv.msg = str + self._ERR_MSG[ves];
                            break;
                        default:
                            el._cddv.validated = true;
                            el._cddv.msg = "[" + v.value.title + "]验证通过";
                    }
                },
                value: function value() {
                    return this;
                }
            };
        }
    }, {
        key: 'ERR_MSG',
        get: function get() {
            return this._ERR_MSG;
        }
    }, {
        key: 'cfg',
        get: function get() {
            return this._cfg;
        }
    }, {
        key: 'regList',
        get: function get() {
            return this._regList;
        }
    }]);

    return V;
})();

exports['default'] = new V();
module.exports = exports['default'];