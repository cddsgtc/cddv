export default class V {


}

enum VruleState { notCheck, validated, unvalidated }
// 每条规则的状态
class Vrule {
  title?: string
  name?: string
  rul: any
  state = VruleState.notCheck
  errMsg: string = `${this.title}出现错误`
  dirty = false
}
