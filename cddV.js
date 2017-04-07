class V {
    constructor(o = {
        inputCheckClass: 'input-check-failed',
        finalCheckClass: 'submit-check-failed',
        errorMsgShow: 'cddv-msg-show',
        errorMsgHidden: 'cddv-msg-hidden',
    }) {
        // 需要验证的表单集合
        this._cfg = {
                // 空白文字
                nonvoid(v, bool) {
                    if (bool) {
                        return v.trim() ? 0 : ['nonvoid']
                    } else {
                        return 0
                    }
                },
                // 正则
                reg(v, reg) {
                    return reg.test(v) ? 0 : ['reg']
                },
                // 区间
                limit(v, interval) {
                    return (+v >= interval[0] && +v <= interval[1]) ? 0 : ['limit']
                },
                // 等于
                equal(v, target) {
                    return v == target ? 0 : ['equal']
                },
                // 不等于
                unequal(v, target) {
                    return v != target ? 0 : ['unequal']
                }
            }
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
            }
            // 错误信息提醒
        this._ERR_MSG = {
            nonvoid: '该项要求不能为空值',
            reg: '格式错误',
            limit: '您输入的值不在区间内',
            equal: '两次输入的值不相等',
            unequal: '两次输入的值重复'
        }
        this.inputCheckClass = o.inputCheckClass
        this.finalCheckClass = o.finalCheckClass
        this.errorMsgHidden = o.errorMsgHidden
        this.errorMsgShow = o.errorMsgShow
    }

    cinfig({
        inputCheckClass = 'input-check-failed',
        finalCheckClass = 'submit-check-failed'
    } = {}) {
        this.inputCheckClass = o.inputCheckClass
        this.finalCheckClass = o.finalCheckClass
    }

    get ERR_MSG() {
        return this._ERR_MSG
    }

    get cfg() {
        return this._cfg
    }

    get regList() {
            return this._regList
        }
        // 添加类
    addClass(el, className) {
        let classArr = el.className.split()
        if (classArr.indexOf(className) == -1) {
            classArr.push(className)
            el.className = classArr.join(' ')
        }
    }

    // 移出类
    removeClass(el, className) {
            let reg = new RegExp("(\\s" + className + "|" + className + "\\s)", 'g')
            el.className = el.className.replace(reg, '')
        }
        // 检查
    check(v, el, vm) {
            var checkValue

            if (v.arg == 'reg') {
                if (!this._regList[v.value.format]) {
                    checkValue = typeof v.value.format == 'stirng' ? new RegExp(v.value.format) : v.value.format
                } else {
                    checkValue = this._regList[v.value.format]
                }
            } else if (v.value.aim) {
                checkValue = vm._cddv.forms[v.value.aim].value || vm.$data[v.value.aim]
            } else {
                checkValue = vm.$data[v.value.format] || v.value.format
            }

            var ves = this.cfg[v.arg](el.value, checkValue)
            if (ves == 0) { el._cddv.validated = true } else { el._cddv.validated = false }
            return ves
        }
        // 信息
    msg(v, el, ves) {
        // 错误信息附加信息
        let str = ''
        switch (ves[0]) {
            case 'nonvoid':
                str = '[' + v.value.title + ']'
                el._cddv.msg = str + this._ERR_MSG[ves]
                break
            case 'reg':
                str = "[" + v.value.title + ']格式错误'
                el._cddv.msg = str
                break
            case 'limit':
                str = +el.value < v.value.format[0] ? '[' + v.value.title + ']应该大于' + v.value.format[0] : '[' + v.value.title + ']应该小于' + v.value.format[1]
                el._cddv.msg = this._ERR_MSG[ves] + str
                break
            case 'equal':
                str = "[" + v.value.title + ']'
                el._cddv.msg = str + this._ERR_MSG[ves]
                break
            case 'unequal':
                str = '[' + v.value.title + ']'
                el._cddv.msg = str + this._ERR_MSG[ves]
                break
            default:
                el._cddv.msg = "[" + v.value.title + "]验证通过"
        }
    }
    install(Vue, options) {
        // cddv本身
        let self = this
            // 验证上的指令
        Vue.directive('cddv-input', {
                bind(el, binding, vnode) {
                    // 指令值
                    let v = {
                            value: binding.value || '',
                            arg: binding.arg || '',
                        }
                        // 当前实例
                    let vm = vnode.context,
                        cddv = vm._cddv

                    // 给el添加_cddv
                    el._cddv = {
                            dirty: false,
                            v_type: v.arg,
                            indeed_value: v.value.format,
                            validated: false,
                            msg: '未进行验证',
                            title: v.value.title
                        }
                        // 初始化
                    cddv.forms[v.value.id] = el
                        // 给该元素添加监听事件验证
                    el.onchange = function() {
                        // 查看当前表单是否输入果值
                        if (!el._cddv.dirty) el._cddv.dirty = true
                            // 进行验证
                        let ves = 0
                        ves = self.check(v, el, vm)
                            // 对每个元素设置
                        self.msg(v, el, ves)
                            // 如果验证错误则添加一个类
                        if (el._cddv.validated) {
                            self.removeClass(el, self.inputCheckClass)
                        } else {
                            self.addClass(el, self.inputCheckClass)
                        }
                        // 定义自定义事件
                        vm.$emit('cddv-checked')
                    }
                }
            })
            // 输出错误信息方法
        Vue.directive('cddv-msg', {
                bind(el, binding, vnode) {
                    let v = {
                        arg: binding.arg
                    }
                    let vm = vnode.context

                    self.addClass(el, self.errorMsgHidden)
                        // 自定义事件，监听目标值的变化
                    vm.$on('cddv-checked', function() {
                        let listener = vm._cddv.forms[v.arg]
                        if (listener._cddv.validated) {
                            self.removeClass(el, self.errorMsgShow)
                            self.addClass(el, self.errorMsgHidden)
                        } else if (!listener._cddv.validated && listener._cddv.dirty) {
                            self.removeClass(el, self.errorMsgHidden)
                            self.addClass(el, self.errorMsgShow)
                            el.innerHTML = listener._cddv.msg
                        }
                    })
                }
            })
            // 提交按钮自定认证
        Vue.directive('cddv-final-check', {
                bind(el, binding, vnode) {
                    let v = {
                        arg: binding.arg || '',
                        value: binding.value || ''
                    }
                    let vm = vnode.context
                        // 判断指定的表单是否验证通过
                    vm.$on('cddv-checked', () => {
                        let validated = true

                        // 如果传递了key选项择进行指定的验证
                        if (v.value.keys) {
                            validated = v.value.keys.every((item, index) => {
                                return vm._cddv.forms[item]._cddv.validated
                            })
                        } else {
                            for (let item in vm._cddv.forms) {
                                if (item == 'undefined') {
                                    continue
                                } else {

                                    if (!vm._cddv.forms[item]._cddv.validated) {
                                        validated = false
                                        break
                                    }
                                }
                            }
                        }
                        if (!validated) { //验证未通过
                            el.onclick = () => {}
                            self.addClass(el, self.finalCheckClass)
                        } else { //验证通过
                            self.removeClass(el, self.finalCheckClass)
                            if (v.arg) {
                                el.onclick = vm[v.arg]
                            } else(
                                el.onclick = v.value.method
                            )
                        }
                        // 如果通过则执行
                    })
                }
            })
            // 实例方法，为每个实例添加一个对象属性
        Vue.prototype._cddv = {
            forms: {}
        }

        Vue.mixin({
            mounted() {

            }
        })
    }
}
export default V
